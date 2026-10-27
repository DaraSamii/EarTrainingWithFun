import { pick, randInt } from '../../music/theory'
import { progression } from '../../music/harmony'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.cadences
/** Every cadence is four chords so length never gives the answer away */
const MAJOR: Record<string, string[]> = {
  authentic: ['I', 'IV', 'V', 'I'], plagal: ['I', 'V', 'IV', 'I'], half: ['I', 'IV', 'I', 'V'], deceptive: ['I', 'IV', 'V', 'vi'],
}
const MINOR: Record<string, string[]> = {
  authentic: ['i', 'iv', 'V', 'i'], plagal: ['i', 'v', 'iv', 'i'], half: ['i', 'iv', 'i', 'V'], deceptive: ['i', 'iv', 'V', 'VI'],
}
const ALL = ['authentic', 'half', 'plagal', 'deceptive']
const LEVELS = [['authentic', 'half'], ['authentic', 'half', 'plagal'], ALL, ALL, ALL, ALL]
/** 0 major, 1 minor, 2 either */
const MODE = [0, 0, 0, 1, 2, 2]
/** chord length: the last level moves twice as fast */
const SPEED = [0.7, 0.7, 0.7, 0.7, 0.7, 0.4]

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: S.names[x], sub: S.subs[x] }))
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: i === 3 ? set : freshOf(set, LEVELS[i - 1]),
    demo: (id) => progression(60, (MODE[i] === 1 ? MINOR : MAJOR)[id], SPEED[i]),
    hint: (id) => S.hints[id],
    generate(rng) {
      const t = randInt(rng, 55, 64)
      const minor = MODE[i] === 1 || (MODE[i] === 2 && rng() < 0.5)
      const table = minor ? MINOR : MAJOR
      const id = pick(rng, set)
      return { options, answer: id, prompt: progression(t, table[id], SPEED[i]), hear: (x) => progression(t, table[x], SPEED[i]) }
    },
  }
}

export const cadences: Game = {
  id: 'cadences', course: 'harmony', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'lab', worldName: S.world, arcade: 'potion', journeyOffset: 2, instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
