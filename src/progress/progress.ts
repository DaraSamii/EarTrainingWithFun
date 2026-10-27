import { remember, type Answer, type Memory } from './srs'

export type LevelStats = {
  best: number
  done: boolean
  plays: number
  learned?: boolean
  practiced?: boolean
  stars?: number
  hiScore?: number
}

export type Progress = {
  xp: number
  dailyGoal: number
  today: string | null
  todayXp: number
  streak: number
  lastGoalDay: string | null
  bestCombo: number
  badges: string[]
  /** XP earned per local day (last ~5 weeks) for the streak calendar and goal chart */
  xpDays: Record<string, number>
  /** spaced-repetition memory per item (ADR-022) */
  memory: Record<string, Memory>
  /** unit reviews: best accuracy, done at ≥ 80% */
  reviews: Record<string, { best: number; done: boolean }>
  levels: Record<string, LevelStats>
}

export const initialProgress: Progress = {
  xp: 0, dailyGoal: 20, today: null, todayXp: 0, streak: 0, lastGoalDay: null, bestCombo: 0, badges: [], xpDays: {}, memory: {}, reviews: {}, levels: {},
}

export const PASS = 0.8
const EMPTY: LevelStats = { best: 0, done: false, plays: 0 }

/** Local calendar day, YYYY-MM-DD (streaks use the learner's time zone) */
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Day key `n` days before `day` (local calendar, DST-safe) */
export function shiftDay(day: string, n: number) {
  const [y, m, d] = day.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d - n))
}
const prevDay = (day: string) => shiftDay(day, 1)
const HISTORY_DAYS = 35

export const sessionXp = (correct: number, total: number) => 10 + correct + (correct === total ? 5 : 0)

/** Stars from first-try accuracy (ADR-014); 2 stars completes a level */
export const starsFor = (acc: number) => (acc >= 0.95 ? 3 : acc >= PASS ? 2 : acc >= 0.6 ? 1 : 0)

/** Streak as displayed today: it lapses if the goal wasn't met today or yesterday */
export const currentStreak = (p: Progress, today: string) =>
  p.lastGoalDay === today || p.lastGoalDay === prevDay(today) ? p.streak : 0

export const todayXp = (p: Progress, today: string) => (p.today === today ? p.todayXp : 0)

export const level = (p: Progress, id: string): LevelStats => p.levels[id] ?? EMPTY

export function addXp(p: Progress, xp: number, today: string): Progress {
  const before = todayXp(p, today)
  const after = before + xp
  const metGoal = before < p.dailyGoal && after >= p.dailyGoal
  const oldest = shiftDay(today, HISTORY_DAYS)
  const xpDays = Object.fromEntries(Object.entries({ ...p.xpDays, [today]: (p.xpDays?.[today] ?? 0) + xp }).filter(([d]) => d > oldest))
  return {
    ...p,
    xp: p.xp + xp,
    xpDays,
    today,
    todayXp: after,
    streak: metGoal ? currentStreak(p, today) + 1 : p.streak,
    lastGoalDay: metGoal ? today : p.lastGoalDay,
  }
}

export const GOALS = [10, 20, 30, 50]
export const setGoal = (p: Progress, goal: number): Progress => ({ ...p, dailyGoal: goal })

/** The 7 days of the current week (Mon–Sun) with the XP earned on each */
export function week(p: Progress, today: string) {
  const [y, m, d] = today.split('-').map(Number)
  const mondayOffset = (new Date(y, m - 1, d).getDay() + 6) % 7
  return Array.from({ length: 7 }, (_, i) => {
    const day = shiftDay(today, mondayOffset - i)
    return { day, xp: p.xpDays?.[day] ?? 0, future: day > today }
  })
}

/** How a score feels, from the learner's passing mark: perfect, great, passed, close, keep going */
export function verdict(acc: number, pass = PASS) {
  return acc >= 1 ? 'perfect' : acc >= Math.max(0.9, pass) ? 'great' : acc >= pass ? 'passed' : acc >= pass - 0.2 ? 'close' : 'low'
}

const patch = (p: Progress, id: string, f: (l: LevelStats) => Partial<LevelStats>): Progress =>
  ({ ...p, levels: { ...p.levels, [id]: { ...level(p, id), ...f(level(p, id)) } } })

export const LEARN_XP = 5

export const applyLearn = (p: Progress, id: string, today: string) =>
  level(p, id).learned ? p : patch(addXp(p, LEARN_XP, today), id, () => ({ learned: true }))

const withMemory = (p: Progress, answers: Answer[], today: string): Progress =>
  answers.length ? { ...p, memory: remember(p.memory ?? {}, answers, today) } : p

/** Practice unlocks Play only when it reaches the learner's passing score; otherwise practice again */
export const applyPractice = (p: Progress, id: string, correct: number, total: number, today: string, answers: Answer[] = [], pass = PASS) =>
  withMemory(patch(addXp(p, sessionXp(correct, total), today), id, (l) => ({
    practiced: l.practiced || correct / total >= pass, best: Math.max(l.best, correct / total),
  })), answers, today)

/** Reviews pay 1.5× XP: coming back is the part that makes it stick (knowledge base §3) */
export const reviewXp = (correct: number, total: number) => Math.round(sessionXp(correct, total) * 1.5)

export function applyReview(p: Progress, unit: string | null, correct: number, total: number, today: string, answers: Answer[], pass = PASS): Progress {
  const next = withMemory(addXp(p, reviewXp(correct, total), today), answers, today)
  if (!unit) return next
  const prev = p.reviews?.[unit] ?? { best: 0, done: false }
  return { ...next, reviews: { ...p.reviews, [unit]: { best: Math.max(prev.best, correct / total), done: prev.done || correct / total >= pass } } }
}

export type PlayResult = { correct: number; total: number; score: number; maxCombo: number; answers?: Answer[] }

export const playXp = (r: PlayResult) => sessionXp(r.correct, r.total) + 5 * starsFor(r.correct / r.total)

/** A level is complete when Play reaches the passing score; stars stay fixed brackets (60/80/95%) */
export function applyPlay(p: Progress, id: string, r: PlayResult, today: string, pass = PASS): Progress {
  const stars = starsFor(r.correct / r.total)
  const next = patch(addXp(p, playXp(r), today), id, (l) => ({
    plays: l.plays + 1,
    best: Math.max(l.best, r.correct / r.total),
    stars: Math.max(l.stars ?? 0, stars),
    hiScore: Math.max(l.hiScore ?? 0, r.score),
    done: l.done || r.correct / r.total >= pass,
  }))
  return withMemory({ ...next, bestCombo: Math.max(p.bestCombo, r.maxCombo) }, r.answers ?? [], today)
}

// ---------- Badges (derived once, then kept forever) ----------

export const BADGES = ['firstLearn', 'firstPlay', 'triple', 'combo10', 'streak3', 'stars10', 'explorer', 'reviewer', 'sectionA'] as const
export type BadgeId = (typeof BADGES)[number]

export const totalStars = (p: Progress) => Object.values(p.levels).reduce((s, l) => s + (l.stars ?? 0), 0)

export function earnedBadges(p: Progress, allLevelIds: string[]): BadgeId[] {
  const ls = Object.values(p.levels)
  const ok: Record<BadgeId, boolean> = {
    firstLearn: ls.some((l) => l.learned),
    firstPlay: ls.some((l) => l.plays > 0),
    triple: ls.some((l) => l.stars === 3),
    combo10: p.bestCombo >= 10,
    streak3: p.streak >= 3,
    stars10: totalStars(p) >= 10,
    explorer: new Set(Object.keys(p.levels).filter((id) => p.levels[id].learned).map((id) => id.split(':')[0])).size >= 5,
    reviewer: Object.values(p.reviews ?? {}).filter((r) => r.done).length >= 3,
    sectionA: allLevelIds.every((id) => level(p, id).done),
  }
  return BADGES.filter((b) => ok[b])
}

/** Adds newly satisfied badges; returns the new progress and which badges are new */
export function withBadges(p: Progress, allLevelIds: string[]): [Progress, BadgeId[]] {
  const fresh = earnedBadges(p, allLevelIds).filter((b) => !p.badges.includes(b))
  return fresh.length ? [{ ...p, badges: [...p.badges, ...fresh] }, fresh] : [p, []]
}
