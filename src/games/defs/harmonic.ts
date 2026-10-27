import { pick, randInt, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'
import { INTERVALS, type IntervalId } from './intervals'

const S = en.games.harmonic
const LEVELS: IntervalId[][] = [
  ['P5', 'P8'], ['M3', 'P5', 'P8'], ['m3', 'M3', 'P5'], ['M2', 'm3', 'M3', 'P4'],
  ['P4', 'P5', 'm6', 'M6'], ['m3', 'M3', 'P4', 'P5', 'M6', 'P8'], ['m2', 'TT', 'm7', 'M7', 'P8'],
  ['M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm7'],
]

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: en.intervals[x], sub: S.colors[x] }))
  // early levels play the two notes one after the other first, then together
  const dyad = (root: number, x: string): Step[] => {
    const top = root + INTERVALS[x as IntervalId]
    return i < 2
      ? [{ notes: [root], dur: 0.45 }, { notes: [top], dur: 0.45 }, { notes: [], dur: 0.15 }, { notes: [root, top], dur: 1.5 }]
      : [{ notes: [root, top], dur: 1.6 }]
  }
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => dyad(60, id),
    hint: (id) => S.colors[id],
    generate(rng) {
      const root = randInt(rng, 50, 64)
      const id = pick(rng, set)
      return { options, answer: id, prompt: dyad(root, id), hear: (x) => dyad(root, x) }
    },
  }
}

export const harmonic: Game = {
  id: 'harmonic', course: 'intervals', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'ocean', worldName: S.world, arcade: 'drops', journeyOffset: 1, instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
