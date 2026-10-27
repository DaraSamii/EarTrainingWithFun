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

export type { CourseId, Game, GameId, Level, Option, Question, Visual } from './types'
export { resolution } from './defs/degrees'

export const GAMES: Record<GameId, Game> = { pitch, intervals, degrees, scales, contour, chords, timbre, notes, keysigs }

export type Course = { id: CourseId; title: string; blurb: string; color: string; games: GameId[] }

/** Courses group games by skill (ADR-017) */
export const COURSES: Course[] = (
  [
    ['pitch', 'red', ['pitch']],
    ['intervals', 'iris', ['intervals']],
    ['scales', 'yellow', ['degrees', 'scales']],
    ['melody', 'green', ['contour']],
    ['harmony', 'pink', ['chords']],
    ['sounds', 'sky', ['timbre']],
    ['theory', 'ink', ['notes', 'keysigs']],
  ] as [CourseId, string, GameId[]][]
).map(([id, color, games]) => ({ id, color, games, ...en.courses[id] }))

export const courseOf = (g: GameId) => COURSES.find((c) => c.id === GAMES[g].course)!

export const levelId = (game: GameId, level: number) => `${game}:${level}`

export type Node = [GameId, number]
export type Unit = { title: string; nodes: Node[] }

const chunk = <T,>(xs: T[], n: number) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n))

/** Interleave: every game's level 1, then every level 2, … in the given order */
const tiers = (games: GameId[]): Node[] =>
  [0, 1, 2, 3, 4].flatMap((l) => games.filter((g) => GAMES[g].levels[l]).map((g) => [g, l] as Node))

/** The Journey: one roadmap through every course, for learners who just want to press play (ADR-017) */
const JOURNEY_ORDER: GameId[] = ['pitch', 'degrees', 'intervals', 'chords', 'notes', 'timbre', 'contour', 'scales', 'keysigs']
export const JOURNEY: Unit[] = chunk(tiers(JOURNEY_ORDER), 5).map((nodes, i) => ({ title: en.journey.units[i] ?? `${en.path.unit} ${i + 1}`, nodes }))

export function coursePath(c: Course): Unit[] {
  const nodes = tiers(c.games)
  const size = c.games.length === 1 ? 5 : 4
  return chunk(nodes, size).map((ns, i) => ({ title: `${en.path.unit} ${i + 1}`, nodes: ns }))
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
