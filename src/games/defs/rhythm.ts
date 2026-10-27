import { pick, randInt, shuffle, type Perc, type Rng, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import type { Game, Level, Option } from '../types'

const S = en.games.rhythm
/** cells per bar, cells per beat, which cells may hold a hit, hit count range, seconds per cell */
type Spec = { cells: number; per: number; allowed: (c: number) => boolean; min: number; max: number; cell: number; sync?: boolean }
const LEVELS: Spec[] = [
  { cells: 8, per: 2, allowed: (c) => c % 2 === 0, min: 2, max: 4, cell: 0.33 },
  { cells: 8, per: 2, allowed: () => true, min: 3, max: 6, cell: 0.33 },
  { cells: 8, per: 2, allowed: () => true, min: 3, max: 5, cell: 0.33, sync: true },
  { cells: 16, per: 4, allowed: (c) => c % 2 === 0 || c % 4 === 3, min: 5, max: 8, cell: 0.19 },
  { cells: 12, per: 3, allowed: () => true, min: 4, max: 8, cell: 0.22 },
  { cells: 16, per: 4, allowed: () => true, min: 6, max: 10, cell: 0.19 },
]

const key = (g: number[]) => g.join('')
const parse = (id: string) => [...id].map(Number)

/** A rhythm always starts on the downbeat; syncopated levels need an off-beat hit followed by a silent beat */
export function randomPattern(rng: Rng, s: Spec): number[] {
  for (;;) {
    const allowed = Array.from({ length: s.cells }, (_, c) => c).filter((c) => c > 0 && s.allowed(c))
    const n = randInt(rng, s.min, s.max) - 1
    const hits = new Set([0, ...shuffle(rng, allowed).slice(0, n)])
    const g = Array.from({ length: s.cells }, (_, c) => (hits.has(c) ? 1 : 0))
    if (!s.sync || g.some((v, c) => v && c % s.per !== 0 && c + 1 < s.cells && (c + 1) % s.per === 0 && !g[c + 1])) return g
  }
}

/** A near-miss of the pattern: one hit moved to a neighbouring free cell, or one hit added/removed */
function variant(rng: Rng, g: number[], s: Spec): number[] {
  const v = [...g]
  const hits = v.map((x, c) => (x && c ? c : -1)).filter((c) => c > 0)
  const free = v.map((x, c) => (!x && s.allowed(c) ? c : -1)).filter((c) => c > 0)
  const r = rng()
  if (r < 0.5 && hits.length && free.length) { v[pick(rng, hits)] = 0; v[pick(rng, free)] = 1 }
  else if (r < 0.75 && free.length) v[pick(rng, free)] = 1
  else if (hits.length > 1) v[pick(rng, hits)] = 0
  else if (free.length) v[pick(rng, free)] = 1
  return v
}

/** One bar of count-in clicks on the beats, then the rhythm on the woodblock */
export function rhythmSteps(g: number[], s: Pick<Spec, 'per' | 'cell'>, countIn = true): Step[] {
  const beats = g.length / s.per
  const count: Step[] = countIn
    ? Array.from({ length: beats }, (_, b) => ({ notes: [], dur: s.cell * s.per, perc: [b === 0 ? 'accent' : 'hat'] as Perc[] }))
    : []
  return [...count, ...g.map((x, c) => ({ notes: [], dur: s.cell, perc: x ? (['click'] as Perc[]) : c % s.per === 0 ? (['hat'] as Perc[]) : undefined, vel: x ? 1 : 0.5 }))]
}

function level(i: number): Level {
  const s = LEVELS[i]
  // example rhythms that Learn demonstrates
  const examples = S.examples[i].map(([id, label]) => ({ id, label, grid: parse(id) }))
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i],
    options: examples,
    fresh: examples.map((o) => o.id),
    demo: (id) => rhythmSteps(parse(id), s),
    hint: (id) => examples.find((o) => o.id === id)?.label ?? '',
    generate(rng) {
      const answer = randomPattern(rng, s)
      const seen = new Set([key(answer)])
      const opts: number[][] = [answer]
      for (let k = 0; opts.length < 3 && k < 50; k++) {
        const v = variant(rng, answer, s)
        if (!seen.has(key(v))) { seen.add(key(v)); opts.push(v) }
      }
      const options: Option[] = shuffle(rng, opts).map((g, k) => ({ id: key(g), label: `${S.pattern} ${'ABC'[k]}`, grid: g }))
      return { options, answer: key(answer), prompt: rhythmSteps(answer, s), hear: (x) => rhythmSteps(parse(x), s, false) }
    },
  }
}

export const rhythm: Game = {
  id: 'rhythm', course: 'rhythm', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'garden', worldName: S.world, arcade: 'blaster', instruments: [],
  levels: LEVELS.map((_, i) => level(i)),
}
