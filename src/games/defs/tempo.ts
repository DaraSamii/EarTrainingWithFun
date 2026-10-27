import { pick, randInt, type Perc, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import type { Game, Level } from '../types'

const S = en.games.tempo
/** how much faster or slower the second bar is */
const CHANGE = [0.35, 0.22, 0.14, 0.09, 0.06]
const IDS = ['faster', 'slower', 'same']

/** two bars of a simple beat; the second bar's tempo is scaled */
function bars(beat: number, scale: number, style: number): Step[] {
  const bar = (b: number): Step[] => [0, 1, 2, 3].flatMap((k) => [
    { notes: [], dur: b / 2, perc: (k === 0 ? ['kick', 'hat'] : k === 2 && style ? ['snare', 'hat'] : ['hat']) as Perc[] },
    { notes: [], dur: b / 2, perc: style ? (['hat'] as Perc[]) : undefined, vel: 0.5 },
  ])
  return [...bar(beat), { notes: [], dur: beat * 0.5 }, ...bar(beat * scale)]
}

function level(i: number): Level {
  const options = IDS.map((id) => ({ id, label: S.names[id], sub: S.subs[id] }))
  const scaleOf = (id: string) => (id === 'faster' ? 1 - CHANGE[i] : id === 'slower' ? 1 + CHANGE[i] : 1)
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: i === 0 ? IDS : [],
    demo: (id) => bars(0.5, scaleOf(id), 1),
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, IDS)
      const beat = 0.42 + rng() * 0.2
      const style = randInt(rng, 0, 1)
      return { options, answer: id, prompt: bars(beat, scaleOf(id), style), hear: (x) => bars(beat, scaleOf(x), style) }
    },
  }
}

export const tempo: Game = {
  id: 'tempo', course: 'rhythm', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'mountains', worldName: S.world, arcade: 'hurdles', instruments: [],
  levels: CHANGE.map((_, i) => level(i)),
}
