import { GAMES, isByLevel, isUnlocked, levelId, type GameId, type Question, type Unit } from './catalog'
import type { Rng } from '../music/theory'
import { level as levelStats, type Progress } from '../progress/progress'
import { dueKeys, weakestKeys } from '../progress/srs'

export type QuizItem = { q: Question; game: GameId; level: number; review?: boolean }

/** Recreate a question that trains `key`, searching down from the level it was last met in */
export function questionFor(key: string, lvl: number, rng: Rng): QuizItem | null {
  const [g, target] = key.split(/:(.*)/s) as [GameId, string]
  const game = GAMES[g]
  if (!game) return null
  for (let l = Math.min(lvl, game.levels.length - 1); l >= 0; l--) {
    const level = game.levels[l]
    if (isByLevel(g)) return target === `L${l}` ? { q: level.generate(rng), game: g, level: l, review: true } : null
    if (!level.options.some((o) => o.id === target)) continue
    for (let k = 0; k < 60; k++) {
      const q = level.generate(rng)
      if (q.answer === target) return { q, game: g, level: l, review: true }
    }
  }
  return null
}

/** Spread games apart so neighbours differ: interleaving (Kornell & Bjork 2008) */
export function interleave(items: QuizItem[]): QuizItem[] {
  const byGame = new Map<GameId, QuizItem[]>()
  for (const it of items) byGame.set(it.game, [...(byGame.get(it.game) ?? []), it])
  const out: QuizItem[] = []
  while (out.length < items.length)
    for (const list of [...byGame.values()].sort((a, b) => b.length - a.length)) {
      const it = list.shift()
      if (it) out.push(it)
    }
  return out
}

const inScope = (key: string, lvl: number, unit?: Unit) =>
  !unit || unit.nodes.some(([g, l]) => key.startsWith(`${g}:`) && lvl <= l && (!isByLevel(g) || key === `${g}:L${l}`))

/**
 * A review session: due items first, then the weakest ones, optionally limited to one unit.
 * Falls back to fresh questions from the unit's levels when memory is still thin.
 */
export function buildReview(p: Progress, today: string, rng: Rng, unit?: Unit, n = 10): QuizItem[] {
  const mem = p.memory ?? {}
  const keys = [...dueKeys(mem, today), ...weakestKeys(mem, today)].filter((k) => inScope(k, mem[k].lvl, unit))
  const items: QuizItem[] = []
  for (const k of keys) {
    if (items.length >= n) break
    const it = questionFor(k, unit ? Math.min(mem[k].lvl, unitLevel(unit, k)) : mem[k].lvl, rng)
    if (it) items.push(it)
  }
  if (unit)
    for (let k = 0; items.length < n && k < n * 3; k++) {
      const [g, l] = unit.nodes[k % unit.nodes.length]
      if (levelStats(p, levelId(g, l)).learned) items.push({ q: GAMES[g].levels[l].generate(rng), game: g, level: l, review: true })
    }
  return interleave(items)
}

const unitLevel = (u: Unit, key: string) => Math.max(...u.nodes.filter(([g]) => key.startsWith(`${g}:`)).map(([, l]) => l))

/**
 * A practice round: mostly the current level, plus a couple of older items that are due
 * (from this game first, then any learned game), so old skills keep coming back.
 */
export function practiceItems(p: Progress, g: GameId, level: number, today: string, rng: Rng, n = 8, reviews = 2): QuizItem[] {
  const mem = p.memory ?? {}
  const due = dueKeys(mem, today).sort((a, b) => Number(!a.startsWith(`${g}:`)) - Number(!b.startsWith(`${g}:`)))
  const old: QuizItem[] = []
  for (const k of due) {
    if (old.length >= reviews) break
    const [kg] = k.split(':') as [GameId]
    // skip items from the level being practiced: those are not "old"
    if (kg === g && mem[k].lvl >= level) continue
    if (!isUnlocked(p, kg, 0)) continue
    const it = questionFor(k, mem[k].lvl, rng)
    if (it) old.push(it)
  }
  const fresh = Array.from({ length: n - old.length }, () => ({ q: GAMES[g].levels[level].generate(rng), game: g, level }))
  // review items appear in the second half, once the new material is warm
  const half = Math.ceil(fresh.length / 2)
  return [...fresh.slice(0, half), ...old.flatMap((o, i) => [o, ...fresh.slice(half + i, half + i + 1)]), ...fresh.slice(half + old.length)]
}
