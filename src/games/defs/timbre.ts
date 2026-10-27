import { MAJOR, pick, randInt, type Inst, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.timbre
const LEVELS: Inst[][] = [
  ['piano', 'flute'],
  ['piano', 'flute', 'guitar'],
  ['piano', 'flute', 'guitar', 'trumpet', 'violin'],
  ['violin', 'cello', 'flute', 'clarinet', 'saxophone'],
  ['trumpet', 'horn', 'trombone', 'saxophone', 'clarinet', 'xylophone'],
  ['harp', 'guitar', 'piano', 'xylophone'],
  ['cello', 'trombone', 'horn', 'clarinet', 'saxophone', 'violin'],
]
/** Comfortable middle range of each instrument (MIDI) */
const RANGE: Record<Inst, [number, number]> = {
  piano: [55, 72], flute: [62, 81], guitar: [45, 64], trumpet: [57, 74], violin: [57, 79], cello: [41, 60],
  clarinet: [52, 72], saxophone: [52, 72], xylophone: [67, 84], horn: [45, 65], trombone: [40, 60], harp: [48, 72],
}

/** A short major-scale tune moved into the instrument's range */
function tune(inst: Inst, shape: number[], base: number): Step[] {
  const [lo, hi] = RANGE[inst]
  let t = base
  while (t < lo) t += 12
  while (t + 12 > hi && t - 12 >= lo - 5) t -= 12
  return shape.map((d, i) => ({ notes: [t + MAJOR[d]], dur: i === shape.length - 1 ? 1 : 0.45, inst }))
}
const SHAPES = [[0, 2, 4, 2], [0, 1, 2, 4], [4, 2, 0, 4], [0, 4, 2, 0], [2, 3, 4, 0]]

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: S.names[x] }))
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => tune(id as Inst, SHAPES[0], 60),
    hint: (id) => S.hints[id as Inst],
    generate(rng) {
      const id = pick(rng, set)
      const shape = pick(rng, SHAPES)
      const base = 48 + randInt(rng, 0, 11)
      return { options, answer: id, prompt: tune(id, shape, base), hear: (x) => tune(x as Inst, shape, base) }
    },
  }
}

export const timbre: Game = {
  id: 'timbre', course: 'sounds', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'garden', worldName: S.world, arcade: 'drops', instruments: [...new Set(LEVELS.flat())],
  levels: LEVELS.map((_, i) => level(i)),
}
