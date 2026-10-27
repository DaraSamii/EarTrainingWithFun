import { pick, randInt, shuffle, type Inst, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import type { Game, Level } from '../types'

const S = en.games.memory
/** how far the decoys sit from the target (semitones), pause before the choices, choice timbre */
const LEVELS: { off: number[]; wait: number; inst: Inst[] }[] = [
  { off: [3, 4, 5], wait: 0.4, inst: ['piano'] },
  { off: [2, 3], wait: 0.6, inst: ['piano'] },
  { off: [1, 2], wait: 0.8, inst: ['piano'] },
  { off: [1, 2], wait: 1.2, inst: ['flute', 'violin', 'clarinet'] },
  { off: [0.5, 1], wait: 1.5, inst: ['piano', 'flute', 'violin'] },
]
const IDS = ['0', '1', '2']

function level(i: number): Level {
  const { off, wait, inst } = LEVELS[i]
  const options = IDS.map((id) => ({ id, label: S.names[+id] }))
  const build = (target: number, notes: number[], ci: Inst): Step[] => [
    { notes: [target], dur: 1, inst: 'piano' }, { notes: [], dur: wait },
    ...notes.flatMap((n) => [{ notes: [n], dur: 0.7, inst: ci }, { notes: [], dur: 0.15 }]),
  ]
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: i === 0 ? IDS : [],
    demo: (id) => build(64, IDS.map((x) => (x === id ? 64 : 64 + (+x - +id) * 3)), inst[0]),
    hint: () => S.hint,
    generate(rng) {
      const target = randInt(rng, 57, 72)
      const decoys = shuffle(rng, [1, -1]).map((s) => target + s * pick(rng, off))
      const order = shuffle(rng, [target, ...decoys])
      const ci = pick(rng, inst)
      const answer = String(order.indexOf(target))
      return {
        options, answer, prompt: build(target, order, ci),
        hear: (x) => [{ notes: [target], dur: 0.8, inst: 'piano' }, { notes: [order[+x]], dur: 0.9, inst: ci }],
      }
    },
  }
}

export const memory: Game = {
  id: 'memory', course: 'pitch', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'mountains', worldName: S.world, arcade: 'climber', journeyOffset: 1, instruments: ['piano', 'flute', 'violin', 'clarinet'],
  levels: LEVELS.map((_, i) => level(i)),
}
