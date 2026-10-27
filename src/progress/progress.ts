export type LevelStats = { best: number; done: boolean; plays: number }

export type Progress = {
  xp: number
  dailyGoal: number
  today: string | null
  todayXp: number
  streak: number
  lastGoalDay: string | null
  levels: Record<string, LevelStats>
}

export const initialProgress: Progress = {
  xp: 0, dailyGoal: 20, today: null, todayXp: 0, streak: 0, lastGoalDay: null, levels: {},
}

export const PASS = 0.8

/** Local calendar day, YYYY-MM-DD (streaks use the learner's time zone) */
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function prevDay(day: string) {
  const [y, m, d] = day.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d - 1))
}

export const sessionXp = (correct: number, total: number) => 10 + correct + (correct === total ? 5 : 0)

/** Streak as displayed today: it lapses if the goal wasn't met today or yesterday */
export const currentStreak = (p: Progress, today: string) =>
  p.lastGoalDay === today || p.lastGoalDay === prevDay(today) ? p.streak : 0

export const todayXp = (p: Progress, today: string) => (p.today === today ? p.todayXp : 0)

export function applySession(p: Progress, levelId: string, correct: number, total: number, today: string): Progress {
  const xp = sessionXp(correct, total)
  const before = todayXp(p, today)
  const after = before + xp
  const metGoal = before < p.dailyGoal && after >= p.dailyGoal
  const acc = correct / total
  const prev = p.levels[levelId] ?? { best: 0, done: false, plays: 0 }
  return {
    ...p,
    xp: p.xp + xp,
    today,
    todayXp: after,
    streak: metGoal ? currentStreak(p, today) + 1 : p.streak,
    lastGoalDay: metGoal ? today : p.lastGoalDay,
    levels: { ...p.levels, [levelId]: { best: Math.max(prev.best, acc), done: prev.done || acc >= PASS, plays: prev.plays + 1 } },
  }
}
