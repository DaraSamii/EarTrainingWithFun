import { shiftDay } from './progress'

/**
 * Successive relearning (Rawson & Dunlosky 2022): retrieve to criterion, then relearn in spaced sessions.
 * Each remembered thing (an interval, a chord color, a scale degree…) is an item in a Leitner box;
 * the box decides how many days until it comes back. A miss drops it back so it returns tomorrow.
 */
export const BOX_DAYS = [0, 1, 3, 7, 16, 35, 75]
export const STRONG_BOX = 4

export type Memory = {
  box: number
  /** day the item is next due (local YYYY-MM-DD) */
  due: string
  seen: number
  lapses: number
  /** level the item was last met in, so reviews can recreate it */
  lvl: number
}

export type Answer = { key: string; ok: boolean; lvl: number }

const after = (day: string, n: number) => shiftDay(day, -n)

/** Update memories with one session's first-try answers (each item counts once per session) */
export function remember(mem: Record<string, Memory>, answers: Answer[], today: string): Record<string, Memory> {
  const next = { ...mem }
  const seen = new Set<string>()
  for (const a of answers) {
    if (seen.has(a.key)) continue
    seen.add(a.key)
    const m = next[a.key] ?? { box: 0, due: today, seen: 0, lapses: 0, lvl: a.lvl }
    // only a successful recall on a due (or new) item earns a longer gap: cramming early does not
    const wasDue = m.due <= today
    const box = a.ok ? (wasDue ? Math.min(m.box + 1, BOX_DAYS.length - 1) : m.box) : Math.max(1, m.box - 2)
    next[a.key] = {
      box,
      due: a.ok ? (wasDue ? after(today, BOX_DAYS[box]) : m.due) : after(today, 1),
      seen: m.seen + 1,
      lapses: m.lapses + (a.ok ? 0 : 1),
      lvl: Math.max(m.lvl, a.lvl),
    }
  }
  return next
}

/** Items due today, most overdue (then weakest) first */
export const dueKeys = (mem: Record<string, Memory>, today: string) =>
  Object.entries(mem)
    .filter(([, m]) => m.due <= today)
    .sort(([, a], [, b]) => (a.due === b.due ? a.box - b.box : a.due < b.due ? -1 : 1))
    .map(([k]) => k)

/** Not due, but the weakest items first: used to fill a review when little is due */
export const weakestKeys = (mem: Record<string, Memory>, today: string) =>
  Object.entries(mem)
    .filter(([, m]) => m.due > today)
    .sort(([, a], [, b]) => a.box - b.box || b.lapses - a.lapses || (a.due < b.due ? -1 : 1))
    .map(([k]) => k)

export const strength = (mem: Record<string, Memory>) => {
  const all = Object.values(mem)
  return { total: all.length, strong: all.filter((m) => m.box >= STRONG_BOX).length }
}
