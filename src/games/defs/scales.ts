import { pick, randInt, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  penta: [0, 2, 4, 7, 9, 12],
  harmonic: [0, 2, 3, 5, 7, 8, 11, 12],
  melodic: [0, 2, 3, 5, 7, 9, 11, 12],
  dorian: [0, 2, 3, 5, 7, 9, 10, 12],
  mixolydian: [0, 2, 4, 5, 7, 9, 10, 12],
  lydian: [0, 2, 4, 6, 7, 9, 11, 12],
  phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
  locrian: [0, 1, 3, 5, 6, 8, 10, 12],
  blues: [0, 3, 5, 6, 7, 10, 12],
  whole: [0, 2, 4, 6, 8, 10, 12],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
}
type ScaleId = keyof typeof SCALES
const S = en.games.scales
const LEVELS: ScaleId[][] = [
  ['major', 'minor'], ['major', 'minor', 'penta'], ['major', 'minor', 'harmonic'], ['major', 'minor', 'harmonic', 'melodic'],
  ['major', 'minor', 'dorian', 'mixolydian'], ['major', 'minor', 'lydian', 'phrygian'],
  ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'minor', 'locrian'], ['penta', 'blues', 'whole', 'chromatic', 'harmonic'],
]

const run = (root: number, id: string): Step[] =>
  SCALES[id as ScaleId].map((x, i, a) => ({ notes: [root + x], dur: i === a.length - 1 ? 0.9 : 0.28 }))

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: S.names[x] }))
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => run(60, id),
    hint: (id) => S.hints[id as ScaleId],
    generate(rng) {
      const root = randInt(rng, 55, 64)
      const id = pick(rng, set)
      return { options, answer: id, prompt: run(root, id), hear: (x) => run(root, x) }
    },
  }
}

export const scales: Game = {
  id: 'scales', course: 'scales', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'ocean', worldName: S.world, arcade: 'breaker', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
