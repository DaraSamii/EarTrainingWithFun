import { MAJOR, pick, randInt, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

export const cadence = (t: number): Step[] => [
  { notes: [t - 12, t, t + 4, t + 7], dur: 0.6 },
  { notes: [t - 7, t, t + 5, t + 9], dur: 0.6 },
  { notes: [t - 5, t - 1, t + 2, t + 7], dur: 0.6 },
  { notes: [t - 12, t, t + 4, t + 7], dur: 1.0 },
  { notes: [], dur: 0.5 },
]

const degreeNote = (t: number, d: number) => t + MAJOR[d - 1]

/** Walk from degree d to the nearest tonic: down for 1–4, up for 5–7 */
export function resolution(t: number, d: number): Step[] {
  const path = d <= 4 ? Array.from({ length: d }, (_, i) => degreeNote(t, d - i))
    : [...Array.from({ length: 8 - d }, (_, i) => degreeNote(t, d + i)), t + 12]
  return path.map((n, i) => ({ notes: [n], dur: i === path.length - 1 ? 0.9 : 0.4 }))
}

const S = en.games.degrees
const LEVELS = [[1, 3, 5], [1, 2, 3], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7]]

function level(i: number): Level {
  const degrees = LEVELS[i]
  const anyKey = i === 4
  const options = degrees.map((x) => ({ id: String(x), label: String(x), sub: en.solfege[x - 1] }))
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: freshOf(degrees.map(String), LEVELS[i - 1]?.map(String)),
    demoContext: cadence(60),
    demo: (id) => [{ notes: [degreeNote(60, +id)], dur: 0.9 }, { notes: [], dur: 0.2 }, ...resolution(60, +id)],
    hint: (id) => S.hints[+id - 1],
    keyEvery: anyKey ? 3 : undefined,
    generate(rng, key) {
      const t = key ?? (anyKey ? randInt(rng, 55, 64) : 60)
      const d = pick(rng, degrees)
      return {
        options,
        answer: String(d),
        key: t,
        context: cadence(t),
        prompt: [{ notes: [degreeNote(t, d)], dur: 1.2 }],
        after: [{ notes: [], dur: 0.3 }, ...resolution(t, d)],
        hear: (id) => [{ notes: [degreeNote(t, Number(id))], dur: 0.9 }],
      }
    },
  }
}

export const degrees: Game = {
  id: 'degrees', course: 'scales', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'garden', worldName: S.world, arcade: 'breaker', glyph: 'Do', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
