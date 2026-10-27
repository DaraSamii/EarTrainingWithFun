import { KEYS, pick, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level, type Visual } from '../types'

const S = en.games.keysigs
const LEVELS = [[0, 1, -1], [0, 1, 2, -1, -2], [1, 2, 3, -1, -2, -3], [2, 3, 4, -2, -3, -4], [4, 5, 6, -4, -5, -6], [0, 1, -1, 2, -2], [3, 4, -3, -4, 0, 2]]
/** From this level the answers are relative minor keys (same signature, tonic a minor third lower) */
const MINOR_FROM = 5
const MINOR_NAMES: Record<number, string> = { 0: 'A', 1: 'E', 2: 'B', 3: 'F♯', 4: 'C♯', 5: 'G♯', 6: 'D♯', [-1]: 'D', [-2]: 'G', [-3]: 'C', [-4]: 'F', [-5]: 'B♭', [-6]: 'E♭' }
const SHARPS = ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯', 'B♯']
const FLATS = ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭']

/** Tonic chord of a key (major, or its relative minor), placed around middle C */
function chord(sig: number, minor = false): Step[] {
  const t = 54 + ((KEYS[sig][1] + (minor ? 3 : 6)) % 12)
  const third = minor ? 3 : 4
  return [{ notes: [t, t + third, t + 7], dur: 0.5 }, { notes: [t + third, t + 7, t + 12], dur: 1.2 }]
}

export const sigText = (sig: number) =>
  sig === 0 ? S.none : `${Math.abs(sig)} ${sig > 0 ? (sig === 1 ? S.sharp : S.sharps) : sig === -1 ? S.flat : S.flats}: ${(sig > 0 ? SHARPS : FLATS).slice(0, Math.abs(sig)).join(' ')}`

function level(i: number): Level {
  const set = LEVELS[i]
  const minor = i >= MINOR_FROM
  const options = set.map((s) => ({ id: String(s), label: minor ? `${MINOR_NAMES[s]} ${S.minor}` : `${KEYS[s][0]} ${S.major}` }))
  const staff = (s: number): Visual => ({ kind: 'staff', clef: 'treble', notes: [], keySig: s })
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: i === MINOR_FROM ? set.map(String) : freshOf(set.map(String), LEVELS[i - 1]?.map(String)),
    demo: (id) => chord(+id, minor),
    demoVisual: (id) => staff(+id),
    hint: (id) => sigText(+id),
    generate(rng) {
      const s = pick(rng, set)
      return { options, answer: String(s), visual: staff(s), prompt: [], after: chord(s, minor), hear: (x) => chord(+x, minor) }
    },
  }
}

export const keysigs: Game = {
  id: 'keysigs', course: 'theory', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'notebook', worldName: S.world, arcade: 'drops', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
