import { MAJOR, pick, randInt, type Rng, type Step } from '../music/theory'
import { en } from '../i18n/en'
import { level as levelStats, type Progress } from '../progress/progress'

export type Option = { id: string; label: string; sub?: string }

export type Question = {
  options: Option[]
  answer: string
  prompt: Step[]
  /** Tonal context (cadence); replayable, played when the key changes */
  context?: Step[]
  key?: number
  /** Played right after answering (e.g. resolution to the tonic) */
  after?: Step[]
  /** Sound of any option, for "hear the difference" */
  hear(id: string): Step[]
}

export type Level = {
  title: string
  skill: string
  options: Option[]
  /** Pip's explanation shown first in Learn, when this level introduces a new idea */
  concept?: string
  /** Options introduced in this level (demonstrated in Learn) */
  fresh: string[]
  /** Optional fixed key for the generated question (arcade keeps a key for a few turns) */
  generate(rng: Rng, key?: number): Question
  /** What Learn plays for an option, and its one-line hint */
  demo(id: string): Step[]
  hint(id: string): string
  /** Context played once before the demonstrations */
  demoContext?: Step[]
}

export type GameId = 'degrees' | 'intervals'
export type Game = { id: GameId; title: string; blurb: string; instruction: string; world: string; levels: Level[] }

const fresh = (ids: string[], prev?: string[]) => ids.filter((x) => !prev?.includes(x))

// ---------- Scale Breaker: scale degrees (functional hearing, method M3) ----------

const cadence = (t: number): Step[] => [
  { notes: [t - 12, t, t + 4, t + 7], dur: 0.6 },
  { notes: [t - 7, t, t + 5, t + 9], dur: 0.6 },
  { notes: [t - 5, t - 1, t + 2, t + 7], dur: 0.6 },
  { notes: [t - 12, t, t + 4, t + 7], dur: 1.0 },
  { notes: [], dur: 0.5 },
]

const degreeNote = (t: number, d: number) => t + MAJOR[d - 1]

/** Walk from degree d to the nearest tonic: down for 1–4, up for 5–7 */
export function resolution(t: number, d: number): Step[] {
  const path = d <= 4 ? Array.from({ length: d }, (_, i) => degreeNote(t, d - i))
    : [...Array.from({ length: 8 - d }, (_, i) => degreeNote(t, d + i)), t + 12]
  return path.map((n, i) => ({ notes: [n], dur: i === path.length - 1 ? 0.9 : 0.4 }))
}

const D = en.games.degrees

function degreeLevel(i: number, degrees: number[], prev?: number[], anyKey = false): Level {
  const options = degrees.map((x) => ({ id: String(x), label: String(x), sub: en.solfege[x - 1] }))
  return {
    title: D.levels[i],
    skill: D.skills[i],
    concept: D.concepts[i] || undefined,
    options,
    fresh: fresh(degrees.map(String), prev?.map(String)),
    demoContext: cadence(60),
    demo: (id) => [{ notes: [degreeNote(60, +id)], dur: 0.9 }, { notes: [], dur: 0.2 }, ...resolution(60, +id)],
    hint: (id) => D.hints[+id - 1],
    generate(rng, key) {
      const t = key ?? (anyKey ? randInt(rng, 55, 64) : 60)
      const d = pick(rng, degrees)
      return {
        options,
        answer: String(d),
        key: t,
        context: cadence(t),
        prompt: [{ notes: [degreeNote(t, d)], dur: 1.2 }],
        after: [{ notes: [], dur: 0.3 }, ...resolution(t, d)],
        hear: (id) => [{ notes: [degreeNote(t, Number(id))], dur: 0.9 }],
      }
    },
  }
}

// ---------- Interval Blaster: intervals (method M2) ----------

export const INTERVALS = { m2: 1, M2: 2, m3: 3, M3: 4, P4: 5, TT: 6, P5: 7, m6: 8, M6: 9, m7: 10, M7: 11, P8: 12 } as const
type IntervalId = keyof typeof INTERVALS
const I = en.games.intervals

function intervalLevel(i: number, set: IntervalId[], prev?: IntervalId[], dir: 1 | -1 = 1): Level {
  const options = set.map((x) => ({ id: x, label: en.intervals[x], sub: `${INTERVALS[x]} ${en.lesson.semitones}` }))
  const pair = (root: number, x: string): Step[] => [
    { notes: [root], dur: 0.7 },
    { notes: [root + dir * INTERVALS[x as IntervalId]], dur: 1.1 },
  ]
  return {
    title: I.levels[i],
    skill: I.skills[i],
    concept: I.concepts[i] || undefined,
    options,
    // a new direction re-demonstrates every interval
    fresh: dir === -1 ? set : fresh(set, prev),
    demo: (id) => pair(dir === 1 ? 60 : 72, id),
    hint: (id) => (dir === 1 ? I.songsUp : I.songsDown)[id as 'P5'] ?? '',
    generate(rng) {
      const root = dir === 1 ? randInt(rng, 52, 64) : randInt(rng, 64, 76)
      const id = pick(rng, set)
      return { options, answer: id, prompt: pair(root, id), hear: (x) => pair(root, x) }
    },
  }
}

const DL: number[][] = [[1, 3, 5], [1, 2, 3], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7]]
const IL: IntervalId[][] = [['P5', 'P8'], ['M3', 'P5', 'P8'], ['M3', 'P4', 'P5', 'P8'], ['M2', 'm3', 'M3', 'P4', 'P5'], ['M3', 'P4', 'P5', 'P8']]

export const GAMES: Record<GameId, Game> = {
  degrees: {
    id: 'degrees',
    title: D.title, blurb: D.blurb, instruction: D.instruction, world: D.world,
    levels: DL.map((ds, i) => degreeLevel(i, ds, DL[i - 1], i === 4)),
  },
  intervals: {
    id: 'intervals',
    title: I.title, blurb: I.blurb, instruction: I.instruction, world: I.world,
    levels: IL.map((set, i) => intervalLevel(i, set, i === 4 ? undefined : IL[i - 1], i === 4 ? -1 : 1)),
  },
}

export const levelId = (game: GameId, level: number) => `${game}:${level}`

/** The path: units of level nodes, interleaving the two games */
export const PATH: { title: string; nodes: [GameId, number][] }[] = en.path.units.map((title, u) => ({
  title,
  nodes: u < 2
    ? [['degrees', u * 2], ['intervals', u * 2], ['degrees', u * 2 + 1], ['intervals', u * 2 + 1]]
    : [['degrees', 4], ['intervals', 4]],
}))

export const PATH_IDS = PATH.flatMap((u) => u.nodes.map(([g, l]) => levelId(g, l)))

/** Index of the first unfinished path node (-1 when all are done) */
export const currentIndex = (p: Progress) => PATH_IDS.findIndex((id) => !levelStats(p, id).done)

/** A level is open once every earlier node on the path is complete */
export function isUnlocked(p: Progress, id: string) {
  const cur = currentIndex(p)
  return cur === -1 || PATH_IDS.indexOf(id) <= cur
}

export type Step3 = 'learn' | 'practice' | 'play'

/** The next step the learner must do on a level (ADR-013) */
export function nextStep(p: Progress, id: string): Step3 {
  const l = levelStats(p, id)
  return !l.learned ? 'learn' : !l.practiced ? 'practice' : 'play'
}

export const stepOpen = (p: Progress, id: string, step: Step3) =>
  step === 'learn' || (step === 'practice' ? !!levelStats(p, id).learned : !!levelStats(p, id).practiced)
