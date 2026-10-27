import { MAJOR, pick, randInt, type Inst, type Rng, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.contour
/** A contour is a string of moves: u = up, d = down */
const LEVELS = [['uu', 'dd'], ['uu', 'dd', 'ud', 'du'], ['uuu', 'ddd', 'uud', 'ddu', 'udu'], ['uuu', 'ddd', 'uud', 'ddu', 'udu', 'dud'], ['uuuu', 'dddd', 'uudd', 'dduu', 'udud']]
const LEAPS = [1, 1, 1, 3, 2]
const INSTS: Inst[][] = [['piano'], ['piano'], ['piano'], ['flute'], ['piano', 'flute', 'violin']]

/** Heights for drawing a contour: cumulative sum of moves */
export const shapeOf = (c: string) => [...c].reduce((h, m) => [...h, h[h.length - 1] + (m === 'u' ? 1 : -1)], [0])

// C major scale degrees as MIDI, from C3 to C6
const SCALE = Array.from({ length: 22 }, (_, i) => 48 + Math.floor(i / 7) * 12 + MAJOR[i % 7])

/** A melody following contour c, with steps of 1..leap scale degrees */
export function melodyFor(rng: Rng, c: string, leap: number) {
  const steps = [...c].map(() => randInt(rng, 1, leap))
  let lo = 0, hi = 0, h = 0
  ;[...c].forEach((m, i) => { h += m === 'u' ? steps[i] : -steps[i]; lo = Math.min(lo, h); hi = Math.max(hi, h) })
  let idx = randInt(rng, 7 - lo, Math.max(7 - lo, 14 - hi))
  const out = [SCALE[idx]]
  ;[...c].forEach((m, i) => { idx += m === 'u' ? steps[i] : -steps[i]; out.push(SCALE[idx]) })
  return out
}

const tune = (notes: number[], inst: Inst): Step[] => notes.map((n, i) => ({ notes: [n], dur: i === notes.length - 1 ? 0.9 : 0.42, inst }))

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((c) => ({ id: c, label: S.names[c] ?? c, shape: shapeOf(c) }))
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => tune(melodyFor(() => 0.5, id, 1), INSTS[i][0]),
    hint: (id) => S.hints[id] ?? '',
    generate(rng) {
      const id = pick(rng, set)
      const inst = pick(rng, INSTS[i])
      const notes = melodyFor(rng, id, LEAPS[i])
      return {
        options, answer: id, prompt: tune(notes, inst),
        hear: (x) => (x === id ? tune(notes, inst) : tune(melodyFor(rng, x, LEAPS[i]), inst)),
      }
    },
  }
}

export const contour: Game = {
  id: 'contour', course: 'melody', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'mountains', worldName: S.world, arcade: 'breaker', glyph: '〰', instruments: ['piano', 'flute', 'violin'],
  levels: LEVELS.map((_, i) => level(i)),
}
