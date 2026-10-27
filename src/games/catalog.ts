import { en } from '../i18n/en'
import { level as levelStats, type Progress } from '../progress/progress'
import type { CourseId, Game, GameId } from './types'
import { pitch } from './defs/pitch'
import { intervals } from './defs/intervals'
import { degrees } from './defs/degrees'
import { scales } from './defs/scales'
import { contour } from './defs/contour'
import { chords } from './defs/chords'
import { timbre } from './defs/timbre'
import { notes } from './defs/notes'
import { keysigs } from './defs/keysigs'
import { tuneup } from './defs/tuneup'
import { harmonic } from './defs/harmonic'
import { spot } from './defs/spot'
import { progressions } from './defs/progressions'
import { cadences } from './defs/cadences'
import { rhythm } from './defs/rhythm'
import { meter } from './defs/meter'
import { expression } from './defs/expression'
import { intreader } from './defs/intreader'

export type { CourseId, Game, GameId, Level, Option, Question, Visual } from './types'
export { resolution } from './defs/degrees'

export const GAMES: Record<GameId, Game> = {
  pitch, tuneup, intervals, harmonic, degrees, scales, contour, spot, chords, progressions, cadences,
  rhythm, meter, timbre, expression, notes, intreader, keysigs,
}

export type Course = { id: CourseId; title: string; blurb: string; color: string; games: GameId[] }

/** Courses group games by skill (ADR-017) */
export const COURSES: Course[] = (
  [
    ['pitch', 'red', ['pitch', 'tuneup']],
    ['intervals', 'iris', ['intervals', 'harmonic']],
    ['scales', 'yellow', ['degrees', 'scales']],
    ['melody', 'green', ['contour', 'spot']],
    ['harmony', 'pink', ['chords', 'progressions', 'cadences']],
    ['rhythm', 'orange', ['rhythm', 'meter']],
    ['sounds', 'sky', ['timbre', 'expression']],
    ['theory', 'ink', ['notes', 'intreader', 'keysigs']],
  ] as [CourseId, string, GameId[]][]
).map(([id, color, games]) => ({ id, color, games, ...en.courses[id] }))

export const courseOf = (g: GameId) => COURSES.find((c) => c.id === GAMES[g].course)!

export const levelId = (game: GameId, level: number) => `${game}:${level}`

export type Node = [GameId, number]
/** `section` starts a new section heading above this unit */
export type Unit = { tag: string; title: string; nodes: Node[]; section?: string }

const chunk = <T,>(xs: T[], n: number) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n))

const MAX_LEVELS = Math.max(...Object.values(GAMES).map((g) => g.levels.length))

/** Nodes of one tier: level `l - offset` of every game, in the given order */
const tier = (games: GameId[], t: number, useOffset: boolean): Node[] =>
  games.map((g) => [g, t - (useOffset ? GAMES[g].journeyOffset ?? 0 : 0)] as Node).filter(([g, l]) => l >= 0 && GAMES[g].levels[l])

/** The Journey: one roadmap through every course, for learners who just want to press play (ADR-017) */
const JOURNEY_ORDER: GameId[] = [
  'pitch', 'degrees', 'intervals', 'rhythm', 'chords', 'notes', 'timbre', 'contour', 'expression',
  'scales', 'harmonic', 'meter', 'spot', 'intreader', 'keysigs', 'tuneup', 'progressions', 'cadences',
]
const SECTIONS = Math.max(...JOURNEY_ORDER.map((g) => GAMES[g].levels.length + (GAMES[g].journeyOffset ?? 0)))
export const JOURNEY: Unit[] = Array.from({ length: SECTIONS }, (_, t) =>
  chunk(tier(JOURNEY_ORDER, t, true), 5).map((nodes, k) => ({
    tag: `${en.path.unit} ${t + 1}.${k + 1}`,
    // name a unit by what it trains
    title: [...new Set(nodes.map(([g]) => courseOf(g).title))].join(' · '),
    nodes,
    section: k === 0 ? `${en.path.sectionWord} ${t + 1} · ${en.journey.sections[t] ?? ''}` : undefined,
  })),
).flat()

/** A course path: one unit per level tier, holding that level of every game in the course */
export function coursePath(c: Course): Unit[] {
  return Array.from({ length: MAX_LEVELS }, (_, l) => tier(c.games, l, false))
    .filter((nodes) => nodes.length)
    .flatMap((nodes, l) => chunk(nodes, 4).map((ns) => ({ tag: `${en.path.unit} ${l + 1}`, title: ns.map(([g, lv]) => GAMES[g].levels[lv].title).join(' · '), nodes: ns })))
}

export const ALL_IDS = (Object.keys(GAMES) as GameId[]).flatMap((g) => GAMES[g].levels.map((_, l) => levelId(g, l)))

/** A level opens once the previous level of the same game is complete */
export const isUnlocked = (p: Progress, g: GameId, l: number) => l === 0 || levelStats(p, levelId(g, l - 1)).done

/** The node to play next on a path: first open and unfinished one (null when all done) */
export function currentNode(p: Progress, units: Unit[]): Node | null {
  for (const u of units) for (const [g, l] of u.nodes) if (isUnlocked(p, g, l) && !levelStats(p, levelId(g, l)).done) return [g, l]
  return null
}

export type Step3 = 'learn' | 'practice' | 'play'

/** The next step the learner must do on a level (ADR-013) */
export function nextStep(p: Progress, id: string): Step3 {
  const l = levelStats(p, id)
  return !l.learned ? 'learn' : !l.practiced ? 'practice' : 'play'
}

export const stepOpen = (p: Progress, id: string, step: Step3) =>
  step === 'learn' || (step === 'practice' ? !!levelStats(p, id).learned : !!levelStats(p, id).practiced)

export const courseStars = (p: Progress, c: Course) =>
  c.games.reduce((s, g) => s + GAMES[g].levels.reduce((t, _, l) => t + (levelStats(p, levelId(g, l)).stars ?? 0), 0), 0)

export const courseMax = (c: Course) => c.games.reduce((s, g) => s + GAMES[g].levels.length * 3, 0)
