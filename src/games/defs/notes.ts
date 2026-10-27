import { letterOf, natural, pick } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level, type Visual } from '../types'

const S = en.games.notes
type Clef = Visual['clef']
// Natural notes per level: [letter index, octave]
const POOLS: [Clef, [number, number][]][] = [
  ['treble', [[2, 4], [4, 4], [6, 4], [1, 5], [3, 5]]], // lines E G B D F
  ['treble', [[3, 4], [5, 4], [0, 5], [2, 5]]], // spaces F A C E
  ['treble', [[2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [0, 5], [1, 5], [2, 5], [3, 5]]],
  ['treble', [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]]],
  ['bass', [[4, 2], [5, 2], [6, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3]]],
]

function level(i: number): Level {
  const [clef, pool] = POOLS[i]
  const notes = pool.map(([l, o]) => natural(l, o))
  // lines/spaces levels list notes bottom-to-top (E G B D F); later levels alphabetically
  const letters = [...new Set(notes.map(letterOf))].sort((a, b) => (i < 2 ? 0 : 'CDEFGAB'.indexOf(a) - 'CDEFGAB'.indexOf(b)))
  const options = letters.map((x) => ({ id: x, label: x }))
  const first = (l: string) => notes.find((n) => letterOf(n) === l)!
  const staff = (n: number): Visual => ({ kind: 'staff', clef, notes: [n] })
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: i === 4 ? letters : freshOf(letters, i === 0 ? undefined : [...new Set(POOLS[i - 1][1].map(([l, o]) => letterOf(natural(l, o))))]),
    demo: (id) => [{ notes: [first(id)], dur: 1 }],
    demoVisual: (id) => staff(first(id)),
    hint: (id) => S.hints[i][id] ?? '',
    generate(rng) {
      const n = pick(rng, notes)
      const near = (l: string) => notes.filter((x) => letterOf(x) === l).sort((a, b) => Math.abs(a - n) - Math.abs(b - n))[0]
      return {
        options, answer: letterOf(n), visual: staff(n), prompt: [],
        after: [{ notes: [n], dur: 1 }],
        hear: (x) => [{ notes: [near(x)], dur: 0.9 }],
      }
    },
  }
}

export const notes: Game = {
  id: 'notes', course: 'theory', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'notebook', worldName: S.world, arcade: 'drops', glyph: '𝄞', instruments: ['piano'],
  levels: POOLS.map((_, i) => level(i)),
}
