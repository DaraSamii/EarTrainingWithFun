import { pick, randInt, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import { freshOf, type Game, type Level } from '../types'

const S = en.games.motion
/** semitone sizes of each kind of move */
const SIZES: Record<string, number[]> = { repeat: [0], step: [1, 2], skip: [3, 4], leap: [5, 7, 8, 12] }
const LEVELS = [['repeat', 'step', 'leap'], ['repeat', 'step', 'skip', 'leap'], ['step', 'skip', 'leap'], ['repeat', 'step', 'skip', 'leap'], ['repeat', 'step', 'skip', 'leap']]
/** context notes before the move; downward moves allowed; tempo */
const SPEC = [{ lead: 0, down: false, dur: 0.6 }, { lead: 0, down: false, dur: 0.6 }, { lead: 2, down: false, dur: 0.5 }, { lead: 2, down: true, dur: 0.45 }, { lead: 3, down: true, dur: 0.3 }]

function level(i: number): Level {
  const set = LEVELS[i]
  const { lead, down, dur } = SPEC[i]
  const options = set.map((id) => ({ id, label: S.names[id], sub: S.subs[id] }))
  const tune = (start: number, leadNotes: number[], move: number): Step[] => {
    const last = leadNotes.length ? leadNotes[leadNotes.length - 1] : start
    return [...[...leadNotes.length ? leadNotes : [start]].map((n) => ({ notes: [n], dur })), { notes: [last + move], dur: 0.9 }]
  }
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: freshOf(set, LEVELS[i - 1]),
    demo: (id) => tune(60, [], SIZES[id][0] || 0),
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, set)
      const start = randInt(rng, 57, 67)
      const leadNotes = Array.from({ length: lead }, (_, k) => start + k * pick(rng, [-2, -1, 1, 2]))
      const dir = down && rng() < 0.5 ? -1 : 1
      const move = dir * pick(rng, SIZES[id])
      return { options, answer: id, prompt: tune(start, leadNotes, move), hear: (x) => tune(start, leadNotes, dir * SIZES[x][0]) }
    },
  }
}

export const motion: Game = {
  id: 'motion', course: 'melody', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'garden', worldName: S.world, arcade: 'river', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
