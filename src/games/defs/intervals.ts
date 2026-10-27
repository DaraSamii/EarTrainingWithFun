import { pick, randInt, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

export const INTERVALS = { m2: 1, M2: 2, m3: 3, M3: 4, P4: 5, TT: 6, P5: 7, m6: 8, M6: 9, m7: 10, M7: 11, P8: 12 } as const
export type IntervalId = keyof typeof INTERVALS
const S = en.games.intervals
const LEVELS: IntervalId[][] = [
  ['P5', 'P8'], ['M3', 'P5', 'P8'], ['M3', 'P4', 'P5', 'P8'], ['M2', 'm3', 'M3', 'P4', 'P5'], ['M3', 'P4', 'P5', 'P8'],
  ['m6', 'M6', 'P5', 'P8'], ['TT', 'm7', 'M7', 'P8'], ['M2', 'M3', 'P4', 'P5', 'M6', 'm7', 'P8'],
]
/** 1 = up, -1 = down, 0 = either */
const DIRS = [1, 1, 1, 1, -1, 1, 1, 0]

function level(i: number): Level {
  const set = LEVELS[i]
  const dir = DIRS[i]
  const options = set.map((x) => ({ id: x, label: en.intervals[x], sub: `${INTERVALS[x]} ${en.lesson.semitones}` }))
  const pair = (root: number, x: string, d: number): Step[] => [
    { notes: [root], dur: 0.7 },
    { notes: [root + d * INTERVALS[x as IntervalId]], dur: 1.1 },
  ]
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    // a new direction re-demonstrates every interval
    fresh: dir !== DIRS[i - 1] ? set : freshOf(set, LEVELS[i - 1]),
    demo: (id) => pair(dir === -1 ? 72 : 60, id, dir || 1),
    hint: (id) => (dir === -1 ? S.songsDown : S.songsUp)[id] ?? '',
    generate(rng) {
      const d = dir || pick(rng, [1, -1])
      const root = d === 1 ? randInt(rng, 52, 64) : randInt(rng, 64, 76)
      const id = pick(rng, set)
      return { options, answer: id, prompt: pair(root, id, d), hear: (x) => pair(root, x, d) }
    },
  }
}

export const intervals: Game = {
  id: 'intervals', course: 'intervals', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'space', worldName: S.world, arcade: 'blaster', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
