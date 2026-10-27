import { MAJOR, pick, randInt, shuffle, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.count
const LEVELS = [['1', '3'], ['1', '2', '3'], ['2', '3', '4'], ['3', '4', '5'], ['2', '3', '4', '5']]
/** how many scale steps the chord tones may spread over: about an octave, or three octaves on the last level */
const SPREAD = [9, 9, 9, 9, 21]

/** n different notes drawn from the major scale above `root` */
function chordOf(n: number, root: number, spread: number, rng: () => number): number[] {
  const degrees = shuffle(rng, Array.from({ length: spread }, (_, k) => k)).slice(0, n).sort((a, b) => a - b)
  return degrees.map((d) => root + 12 * Math.floor(d / 7) + MAJOR[d % 7])
}

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((id) => ({ id, label: id, sub: S.notes }))
  const sound = (ns: number[]): Step[] => [{ notes: ns, dur: 1.6 }]
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => [...Array.from({ length: +id }, (_, k) => ({ notes: [60 + [0, 4, 7, 11, 14][k]], dur: 0.35 })), { notes: [], dur: 0.2 }, ...sound([0, 4, 7, 11, 14].slice(0, +id).map((x) => 60 + x))],
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, set)
      const root = SPREAD[i] > 9 ? randInt(rng, 40, 48) : randInt(rng, 48, 58)
      let ns: number[] = []
      ns = chordOf(+id, root, SPREAD[i], rng)
      const spelled = (x: number) => sound(ns.length === x ? ns : [0, 4, 7, 11, 14].slice(0, x).map((d) => root + 12 + d))
      return { options, answer: id, prompt: sound(ns), hear: (x) => spelled(+x) }
    },
  }
}

export const count: Game = {
  id: 'count', course: 'harmony', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'lab', worldName: S.world, arcade: 'potion', journeyOffset: 1, instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
