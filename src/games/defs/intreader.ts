import { diatonic, fromDiatonic, pick, randInt } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level, type Visual } from '../types'

const S = en.games.intreader
/** interval numbers (2 = second … 8 = octave) */
const LEVELS = [['2', '3'], ['3', '4', '5'], ['2', '3', '4', '5'], ['5', '6', '7', '8'], ['2', '3', '4', '5', '6', '7', '8'], ['2', '3', '4', '5', '6', '7', '8']]
const STACK = 5
// lowest note E4, highest A5 on the treble staff
const LO = diatonic(64)
const HI = diatonic(81)

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: S.names[x] }))
  const staff = (lo: number, n: number): Visual => ({ kind: 'staff', clef: 'treble', notes: [fromDiatonic(lo), fromDiatonic(lo + n - 1)], stack: i >= STACK })
  const sound = (v: Visual) => [{ notes: [v.notes[0]], dur: 0.55 }, { notes: [v.notes[1]], dur: 0.55 }, { notes: v.notes, dur: 1.1 }]
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: i === STACK ? set : freshOf(set, LEVELS[i - 1]),
    demo: (id) => sound(staff(LO + 1, +id)),
    demoVisual: (id) => staff(LO + 1, +id),
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, set)
      const lo = randInt(rng, LO, HI - (+id - 1))
      const v = staff(lo, +id)
      return { options, answer: id, visual: v, prompt: [], after: sound(v), hear: (x) => sound(staff(lo, +x)) }
    },
  }
}

export const intreader: Game = {
  id: 'intreader', course: 'theory', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'notebook', worldName: S.world, arcade: 'drops', journeyOffset: 1, instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
