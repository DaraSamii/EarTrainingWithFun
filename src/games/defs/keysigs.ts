import { KEYS, pick, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level, type Visual } from '../types'

const S = en.games.keysigs
const LEVELS = [[0, 1, -1], [0, 1, 2, -1, -2], [1, 2, 3, -1, -2, -3], [2, 3, 4, -2, -3, -4], [4, 5, 6, -4, -5, -6]]
const SHARPS = ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯', 'B♯']
const FLATS = ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭']

/** Tonic chord of a key, placed around middle C */
function chord(sig: number): Step[] {
  const t = 54 + ((KEYS[sig][1] + 6) % 12)
  return [{ notes: [t, t + 4, t + 7], dur: 0.5 }, { notes: [t + 4, t + 7, t + 12], dur: 1.2 }]
}

export const sigText = (sig: number) =>
  sig === 0 ? S.none : `${Math.abs(sig)} ${sig > 0 ? (sig === 1 ? S.sharp : S.sharps) : sig === -1 ? S.flat : S.flats}: ${(sig > 0 ? SHARPS : FLATS).slice(0, Math.abs(sig)).join(' ')}`

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((s) => ({ id: String(s), label: `${KEYS[s][0]} ${S.major}` }))
  const staff = (s: number): Visual => ({ kind: 'staff', clef: 'treble', notes: [], keySig: s })
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: freshOf(set.map(String), LEVELS[i - 1]?.map(String)),
    demo: (id) => chord(+id),
    demoVisual: (id) => staff(+id),
    hint: (id) => sigText(+id),
    generate(rng) {
      const s = pick(rng, set)
      return { options, answer: String(s), visual: staff(s), prompt: [], after: chord(s), hear: (x) => chord(+x) }
    },
  }
}

export const keysigs: Game = {
  id: 'keysigs', course: 'theory', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'notebook', worldName: S.world, arcade: 'blaster', glyph: '♯♭', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
