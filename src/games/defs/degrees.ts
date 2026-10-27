import { MAJOR, MINOR, pick, randInt, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

/** I–IV–V–I in major, i–iv–V–i in minor */
export const cadence = (t: number, minor = false): Step[] => {
  const m = minor ? 3 : 4
  return [
    { notes: [t - 12, t, t + m, t + 7], dur: 0.6 },
    { notes: [t - 7, t, t + 5, t + (minor ? 8 : 9)], dur: 0.6 },
    { notes: [t - 5, t - 1, t + 2, t + 7], dur: 0.6 },
    { notes: [t - 12, t, t + m, t + 7], dur: 1.0 },
    { notes: [], dur: 0.5 },
  ]
}

const degreeNote = (t: number, d: number, minor = false) => t + (minor ? MINOR : MAJOR)[d - 1]

/** Walk from degree d to the nearest tonic: down for 1–4, up for 5–7 */
export function resolution(t: number, d: number, minor = false): Step[] {
  const path = d <= 4 ? Array.from({ length: d }, (_, i) => degreeNote(t, d - i, minor))
    : [...Array.from({ length: 8 - d }, (_, i) => degreeNote(t, d + i, minor)), t + 12]
  return path.map((n, i) => ({ notes: [n], dur: i === path.length - 1 ? 0.9 : 0.4 }))
}

const S = en.games.degrees
const ALL = [1, 2, 3, 4, 5, 6, 7]
const LEVELS = [[1, 3, 5], [1, 2, 3], [1, 2, 3, 4, 5], ALL, ALL, [1, 3, 5], [1, 2, 3, 4, 5], ALL]
/** Levels 6–8 are in minor keys; 5 and 8 change key */
const MINOR_FROM = 5
const ANY_KEY = [4, 7]

function level(i: number): Level {
  const degrees = LEVELS[i]
  const anyKey = ANY_KEY.includes(i)
  const minor = i >= MINOR_FROM
  const flat = (x: number) => minor && [3, 6, 7].includes(x)
  const options = degrees.map((x) => ({ id: String(x), label: `${flat(x) ? '♭' : ''}${x}`, sub: (minor ? en.solfegeMinor : en.solfege)[x - 1] }))
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    // the switch to minor re-demonstrates every degree
    fresh: i === MINOR_FROM ? degrees.map(String) : freshOf(degrees.map(String), LEVELS[i - 1]?.map(String)),
    demoContext: cadence(60, minor),
    demo: (id) => [{ notes: [degreeNote(60, +id, minor)], dur: 0.9 }, { notes: [], dur: 0.2 }, ...resolution(60, +id, minor)],
    hint: (id) => (minor ? S.hintsMinor : S.hints)[+id - 1],
    keyEvery: anyKey ? 3 : undefined,
    generate(rng, key) {
      const t = key ?? (anyKey ? randInt(rng, 55, 64) : 60)
      const d = pick(rng, degrees)
      return {
        options,
        answer: String(d),
        key: t,
        context: cadence(t, minor),
        prompt: [{ notes: [degreeNote(t, d, minor)], dur: 1.2 }],
        after: [{ notes: [], dur: 0.3 }, ...resolution(t, d, minor)],
        hear: (id) => [{ notes: [degreeNote(t, Number(id), minor)], dur: 0.9 }],
      }
    },
  }
}

export const degrees: Game = {
  id: 'degrees', course: 'scales', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'garden', worldName: S.world, arcade: 'breaker', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
