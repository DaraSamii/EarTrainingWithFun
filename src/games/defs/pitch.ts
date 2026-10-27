import { pick, randInt, type Inst, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import type { Game, Level } from '../types'

const S = en.games.pitch
/** Distance between the two notes, in semitones (0.5 = 50 cents) */
const GAPS = [4, 2, 1, 0.5, 0.25]
const INSTS: Inst[][] = [['piano'], ['piano'], ['piano'], ['flute', 'violin'], ['piano', 'flute', 'violin', 'clarinet']]

function level(i: number): Level {
  const gap = GAPS[i]
  const options = [{ id: 'up', label: S.up, sub: '↑' }, { id: 'down', label: S.down, sub: '↓' }]
  const pair = (a: number, id: string, inst: Inst): Step[] => [
    { notes: [a], dur: 0.8, inst }, { notes: [], dur: 0.15 }, { notes: [a + (id === 'up' ? gap : -gap)], dur: 1, inst },
  ]
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: i === 0 || i === 3 ? ['up', 'down'] : [],
    demo: (id) => pair(id === 'up' ? 62 : 67, id, INSTS[i][0]),
    hint: (id) => S.hints[id as 'up'],
    generate(rng) {
      const a = randInt(rng, 57, 72)
      const id = pick(rng, ['up', 'down'])
      const inst = pick(rng, INSTS[i])
      return { options, answer: id, prompt: pair(a, id, inst), hear: (x) => pair(a, x, inst) }
    },
  }
}

export const pitch: Game = {
  id: 'pitch', course: 'pitch', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'mountains', worldName: S.world, arcade: 'drops', glyph: '⇅', instruments: ['piano', 'flute', 'violin', 'clarinet'],
  levels: GAPS.map((_, i) => level(i)),
}
