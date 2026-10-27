import { pick, randInt } from '../../music/theory'
import { numerals, prettyProgression, progression } from '../../music/harmony'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.progressions
const LEVELS = [
  ['I IV I', 'I V I'],
  ['I IV V I', 'I V IV I', 'I IV I V'],
  ['I vi IV V', 'I IV V I', 'I V vi IV'],
  ['I V vi IV', 'I vi IV V', 'vi IV I V', 'I IV vi V'],
  ['I ii V I', 'I IV V I', 'I vi ii V'],
  ['i iv V i', 'i VI VII i', 'i iv v i', 'i VII VI V'],
  ['I IV V vi', 'I iii IV V', 'I IV ii V', 'I V vi IV'],
  ['I V vi IV', 'i VI VII i', 'I ii V I', 'i iv V i'],
]

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: prettyProgression(x) }))
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => progression(60, numerals(id)),
    hint: (id) => S.hints[id] ?? '',
    generate(rng) {
      const t = randInt(rng, 55, 64)
      const id = pick(rng, set)
      return { options, answer: id, prompt: progression(t, numerals(id)), hear: (x) => progression(t, numerals(x)) }
    },
  }
}

export const progressions: Game = {
  id: 'progressions', course: 'harmony', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'space', worldName: S.world, arcade: 'potion', journeyOffset: 2, instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
