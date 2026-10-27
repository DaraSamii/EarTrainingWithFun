import { pick, randInt, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const CHORDS = {
  maj: [0, 4, 7], min: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8],
  maj7: [0, 4, 7, 11], dom7: [0, 4, 7, 10], min7: [0, 3, 7, 10],
}
type ChordId = keyof typeof CHORDS
const S = en.games.chords
const LEVELS: ChordId[][] = [['maj', 'min'], ['maj', 'min', 'dim'], ['maj', 'min', 'dim', 'aug'], ['maj7', 'dom7', 'min7'], ['maj', 'min', 'dim', 'aug', 'dom7']]

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: S.names[x] }))
  // early levels spell the chord out before sounding it together
  const chord = (root: number, id: string): Step[] => {
    const ns = CHORDS[id as ChordId].map((x) => root + x)
    return i < 4
      ? [...ns.map((n) => ({ notes: [n], dur: 0.3 })), { notes: [], dur: 0.1 }, { notes: ns, dur: 1.4 }]
      : [{ notes: ns, dur: 1.6 }]
  }
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => chord(60, id),
    hint: (id) => S.hints[id as ChordId],
    generate(rng) {
      const root = randInt(rng, 52, 62)
      const id = pick(rng, set)
      return { options, answer: id, prompt: chord(root, id), hear: (x) => chord(root, x) }
    },
  }
}

export const chords: Game = {
  id: 'chords', course: 'harmony', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'ocean', worldName: S.world, arcade: 'blaster', glyph: '♫', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
