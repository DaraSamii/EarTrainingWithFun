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
  levels: Record<string, LevelStats>
}

export const initialProgress: Progress = {
  xp: 0, dailyGoal: 20, today: null, todayXp: 0, streak: 0, lastGoalDay: null, bestCombo: 0, badges: [], levels: {},
}

export const PASS = 0.8
const EMPTY: LevelStats = { best: 0, done: false, plays: 0 }

/** Local calendar day, YYYY-MM-DD (streaks use the learner's time zone) */
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function prevDay(day: string) {
  const [y, m, d] = day.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d - 1))
}

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
  return {
    ...p,
    xp: p.xp + xp,
    today,
    todayXp: after,
    streak: metGoal ? currentStreak(p, today) + 1 : p.streak,
    lastGoalDay: metGoal ? today : p.lastGoalDay,
  }
}

const patch = (p: Progress, id: string, f: (l: LevelStats) => Partial<LevelStats>): Progress =>
  ({ ...p, levels: { ...p.levels, [id]: { ...level(p, id), ...f(level(p, id)) } } })

export const LEARN_XP = 5

export const applyLearn = (p: Progress, id: string, today: string) =>
  level(p, id).learned ? p : patch(addXp(p, LEARN_XP, today), id, () => ({ learned: true }))

export const applyPractice = (p: Progress, id: string, correct: number, total: number, today: string) =>
  patch(addXp(p, sessionXp(correct, total), today), id, (l) => ({ practiced: true, best: Math.max(l.best, correct / total) }))

export type PlayResult = { correct: number; total: number; score: number; maxCombo: number }

export const playXp = (r: PlayResult) => sessionXp(r.correct, r.total) + 5 * starsFor(r.correct / r.total)

export function applyPlay(p: Progress, id: string, r: PlayResult, today: string): Progress {
  const stars = starsFor(r.correct / r.total)
  const next = patch(addXp(p, playXp(r), today), id, (l) => ({
    plays: l.plays + 1,
    best: Math.max(l.best, r.correct / r.total),
    stars: Math.max(l.stars ?? 0, stars),
    hiScore: Math.max(l.hiScore ?? 0, r.score),
    done: l.done || stars >= 2,
  }))
  return { ...next, bestCombo: Math.max(p.bestCombo, r.maxCombo) }
}

// ---------- Badges (derived once, then kept forever) ----------

export const BADGES = ['firstLearn', 'firstPlay', 'triple', 'combo10', 'streak3', 'stars10', 'sectionA'] as const
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
    sectionA: allLevelIds.every((id) => level(p, id).done),
  }
  return BADGES.filter((b) => ok[b])
}

/** Adds newly satisfied badges; returns the new progress and which badges are new */
export function withBadges(p: Progress, allLevelIds: string[]): [Progress, BadgeId[]] {
  const fresh = earnedBadges(p, allLevelIds).filter((b) => !p.badges.includes(b))
  return fresh.length ? [{ ...p, badges: [...p.badges, ...fresh] }, fresh] : [p, []]
}
