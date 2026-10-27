import { MAJOR, pick, randInt, type Inst, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.families
/** instrument families and the sampled instruments that belong to them */
const FAMILY: Record<string, Inst[]> = {
  strings: ['violin', 'cello'], woodwinds: ['flute', 'clarinet', 'saxophone'], brass: ['trumpet', 'trombone', 'horn'],
  keys: ['piano'], plucked: ['guitar', 'harp'], mallets: ['xylophone'],
}
const LEVELS = [['strings', 'brass'], ['strings', 'brass', 'woodwinds'], ['strings', 'brass', 'woodwinds', 'keys'], ['strings', 'brass', 'woodwinds', 'keys', 'plucked'], ['strings', 'brass', 'woodwinds', 'keys', 'plucked', 'mallets']]
const RANGE: Partial<Record<Inst, number>> = { cello: 48, trombone: 48, horn: 52, guitar: 52, xylophone: 72, flute: 67 }

function tune(inst: Inst): Step[] {
  const t = RANGE[inst] ?? 60
  return [0, 2, 4, 2].map((d, k) => ({ notes: [t + MAJOR[d]], dur: k === 3 ? 0.9 : 0.42, inst }))
}

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((id) => ({ id, label: S.names[id] }))
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => FAMILY[id].flatMap((inst) => [...tune(inst), { notes: [], dur: 0.3 }]),
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, set)
      const inst = pick(rng, FAMILY[id])
      const shift = randInt(rng, -2, 2)
      const play = (x: Inst) => tune(x).map((s) => ({ ...s, notes: s.notes.map((n) => n + shift) }))
      return { options, answer: id, prompt: play(inst), hear: (x) => play(FAMILY[x][0]) }
    },
  }
}

export const families: Game = {
  id: 'families', course: 'sounds', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'ocean', worldName: S.world, arcade: 'fishing', instruments: [...new Set(Object.values(FAMILY).flat())],
  levels: LEVELS.map((_, i) => level(i)),
}
