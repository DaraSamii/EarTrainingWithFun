import { MAJOR, pick, randInt, type Inst, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.expression
const LEVELS = [
  ['first', 'second'], ['cresc', 'decresc'], ['cresc', 'decresc', 'steady'], ['staccato', 'legato'], ['accel', 'rit', 'steady'],
  ['cresc', 'decresc', 'staccato', 'legato'], ['cresc', 'decresc', 'staccato', 'legato', 'accel', 'rit', 'steady'],
]
const INSTS: Inst[][] = [['piano'], ['piano'], ['piano', 'violin'], ['violin', 'flute'], ['piano'], ['piano', 'violin', 'flute'], ['piano', 'violin', 'flute', 'clarinet']]
const N = 8

/** The same 8-note tune shaped by one expression */
function shaped(id: string, base: number, inst: Inst): Step[] {
  const notes = Array.from({ length: N }, (_, k) => base + MAJOR[[0, 2, 4, 2, 4, 5, 4, 2][k]])
  if (id === 'first' || id === 'second') {
    const tune = (vel: number) => notes.slice(0, 4).map((n) => ({ notes: [n], dur: 0.32, vel, inst }))
    const [a, b] = id === 'first' ? [1, 0.3] : [0.3, 1]
    return [...tune(a), { notes: [], dur: 0.5 }, ...tune(b)]
  }
  return notes.map((n, k) => {
    const f = k / (N - 1)
    const vel = id === 'cresc' ? 0.15 + 0.85 * f : id === 'decresc' ? 1 - 0.85 * f : 0.7
    const dur = id === 'accel' ? 0.5 - 0.3 * f : id === 'rit' ? 0.2 + 0.3 * f : 0.34
    return { notes: [n], dur, vel, inst, len: id === 'staccato' ? 0.08 : undefined }
  })
}

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: S.names[x], sub: S.subs[x] }))
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => shaped(id, 60, INSTS[i][0]),
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, set)
      const base = randInt(rng, 55, 64)
      const inst = pick(rng, INSTS[i])
      return { options, answer: id, prompt: shaped(id, base, inst), hear: (x) => shaped(x, base, inst) }
    },
  }
}

export const expression: Game = {
  id: 'expression', course: 'sounds', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'pond', worldName: S.world, arcade: 'fishing', instruments: ['piano', 'violin', 'flute', 'clarinet'],
  levels: LEVELS.map((_, i) => level(i)),
}
