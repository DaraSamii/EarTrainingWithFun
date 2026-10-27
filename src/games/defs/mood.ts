import { MAJOR, MINOR, pick, randInt, type Step } from '../../music/theory'
import { progression } from '../../music/harmony'
import { en } from '../../i18n/en'
import type { Game, Level } from '../types'

const S = en.games.mood
const TUNES = [[0, 1, 2, 3, 4, 2, 0], [4, 2, 0, 2, 4, 4, 4], [0, 2, 4, 2, 1, 0], [2, 1, 0, 1, 2, 2, 2], [4, 3, 2, 1, 0]]
/** what plays: chords, a tune with chords, a tune alone, a short fragment, a fragment on violin */
const STYLE = ['chords', 'both', 'tune', 'short', 'short'] as const

function sound(id: string, t: number, style: (typeof STYLE)[number], tune: number[], violin = false): Step[] {
  const minor = id === 'minor'
  const scale = minor ? MINOR : MAJOR
  const chords = progression(t, minor ? ['i', 'iv', 'V', 'i'] : ['I', 'IV', 'V', 'I'], 0.6)
  const notes = (style === 'short' ? tune.slice(0, 4) : tune).map((d, k, a) => ({ notes: [t + 12 + scale[d]], dur: k === a.length - 1 ? 0.8 : 0.32, inst: violin ? ('violin' as const) : undefined }))
  return style === 'chords' ? chords : style === 'both' ? [...chords, { notes: [], dur: 0.3 }, ...notes] : notes
}

function level(i: number): Level {
  const options = ['major', 'minor'].map((id) => ({ id, label: S.names[id], sub: S.subs[id] }))
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: i === 0 ? ['major', 'minor'] : [],
    demo: (id) => sound(id, 60, STYLE[i], TUNES[0], i === 4),
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, ['major', 'minor'])
      const t = randInt(rng, 52, 62)
      const tune = pick(rng, TUNES)
      return { options, answer: id, prompt: sound(id, t, STYLE[i], tune, i === 4), hear: (x) => sound(x, t, STYLE[i], tune, i === 4) }
    },
  }
}

export const mood: Game = {
  id: 'mood', course: 'scales', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'garden', worldName: S.world, arcade: 'breaker', instruments: ['piano', 'violin'],
  levels: STYLE.map((_, i) => level(i)),
}
