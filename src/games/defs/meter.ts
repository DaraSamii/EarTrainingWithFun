import { pick, randInt, type Perc, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.meter
/** each beat's number of eighth-note pulses: simple meters split beats in 2, 6/8 in 3, 7/8 is 2+2+3 */
const METERS: Record<string, number[]> = {
  '2/4': [2, 2], '3/4': [2, 2, 2], '4/4': [2, 2, 2, 2], '6/8': [3, 3], '5/4': [2, 2, 2, 2, 2], '7/8': [2, 2, 3],
}
const LEVELS = [['3/4', '4/4'], ['2/4', '3/4', '4/4'], ['3/4', '6/8'], ['2/4', '3/4', '4/4', '6/8'], ['2/4', '3/4', '4/4', '6/8'], ['4/4', '5/4'], ['5/4', '6/8', '7/8']]
/** drums with strong accents → softer accents → a piano "oom-pah" with no drums */
const STYLE = ['drums', 'drums', 'drums', 'soft', 'piano', 'drums', 'soft'] as const

function bars(id: string, style: (typeof STYLE)[number], t: number, tempo: number): Step[] {
  const groups = METERS[id]
  const cell = 0.27 * tempo
  const out: Step[] = []
  for (let bar = 0; bar < 3; bar++)
    for (let b = 0; b < groups.length; b++)
      for (let k = 0; k < groups[b]; k++) {
        const down = b === 0 && k === 0
        const onBeat = k === 0
        if (style === 'piano') {
          out.push({ notes: down ? [t - 12] : onBeat ? [t, t + 4, t + 7] : [], dur: cell, vel: down ? 1 : 0.55 })
        } else {
          const perc: Perc[] = down ? ['kick', style === 'drums' ? 'accent' : 'hat'] : onBeat ? ['hat'] : style === 'drums' ? [] : ['hat']
          out.push({ notes: [], dur: cell, perc, vel: down ? 1 : onBeat ? 0.7 : 0.35 })
        }
      }
  return out
}

function level(i: number): Level {
  const set = LEVELS[i]
  const options = set.map((x) => ({ id: x, label: x, sub: S.names[x] }))
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => bars(id, STYLE[i], 60, 1),
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, set)
      const t = randInt(rng, 55, 64)
      const tempo = 0.85 + rng() * 0.3
      return { options, answer: id, prompt: bars(id, STYLE[i], t, tempo), hear: (x) => bars(x, STYLE[i], t, tempo) }
    },
  }
}

export const meter: Game = {
  id: 'meter', course: 'rhythm', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'track', worldName: S.world, arcade: 'hurdles', journeyOffset: 1, instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
