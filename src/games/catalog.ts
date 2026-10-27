import { MAJOR, pick, randInt, type Rng, type Step } from '../music/theory'
import { en } from '../i18n/en'

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

export type Level = { title: string; generate(rng: Rng): Question }
export type Game = { id: GameId; title: string; blurb: string; instruction: string; levels: Level[] }
export type GameId = 'degrees' | 'intervals'

// ---------- Degree Detective (functional hearing, method M3) ----------

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

function degreeLevel(title: string, degrees: number[], anyKey = false): Level {
  return {
    title,
    generate(rng) {
      const t = anyKey ? randInt(rng, 55, 64) : 60
      const d = pick(rng, degrees)
      return {
        options: degrees.map((x) => ({ id: String(x), label: String(x), sub: en.solfege[x - 1] })),
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

// ---------- Interval Ladder (method M2) ----------

export const INTERVALS = { m2: 1, M2: 2, m3: 3, M3: 4, P4: 5, TT: 6, P5: 7, m6: 8, M6: 9, m7: 10, M7: 11, P8: 12 } as const
type IntervalId = keyof typeof INTERVALS

function intervalLevel(title: string, set: IntervalId[], dir: 1 | -1 = 1): Level {
  return {
    title,
    generate(rng) {
      const root = dir === 1 ? randInt(rng, 52, 64) : randInt(rng, 64, 76)
      const id = pick(rng, set)
      const pair = (i: IntervalId): Step[] => [
        { notes: [root], dur: 0.7 },
        { notes: [root + dir * INTERVALS[i]], dur: 1.1 },
      ]
      return {
        options: set.map((x) => ({ id: x, label: en.intervals[x], sub: `${INTERVALS[x]} ${en.lesson.semitones}` })),
        answer: id,
        prompt: pair(id),
        hear: (x) => pair(x as IntervalId),
      }
    },
  }
}

const l = en.games
export const GAMES: Record<GameId, Game> = {
  degrees: {
    id: 'degrees',
    ...l.degrees,
    levels: [
      degreeLevel(l.degrees.levels[0], [1, 3, 5]),
      degreeLevel(l.degrees.levels[1], [1, 2, 3]),
      degreeLevel(l.degrees.levels[2], [1, 2, 3, 4, 5]),
      degreeLevel(l.degrees.levels[3], [1, 2, 3, 4, 5, 6, 7]),
      degreeLevel(l.degrees.levels[4], [1, 2, 3, 4, 5, 6, 7], true),
    ],
  },
  intervals: {
    id: 'intervals',
    ...l.intervals,
    levels: [
      intervalLevel(l.intervals.levels[0], ['P5', 'P8']),
      intervalLevel(l.intervals.levels[1], ['M3', 'P5', 'P8']),
      intervalLevel(l.intervals.levels[2], ['M3', 'P4', 'P5', 'P8']),
      intervalLevel(l.intervals.levels[3], ['M2', 'm3', 'M3', 'P4', 'P5']),
      intervalLevel(l.intervals.levels[4], ['M3', 'P4', 'P5', 'P8'], -1),
    ],
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
