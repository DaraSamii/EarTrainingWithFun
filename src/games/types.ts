import type { Inst, Rng, Step } from '../music/theory'

export type Option = {
  id: string
  label: string
  sub?: string
  /** melodic contour drawn above the label */
  shape?: number[]
  /** rhythm drawn as a beat grid: 0 rest, 1 hit, 2 accented hit */
  grid?: number[]
}

/** Something shown instead of (or before) a sound: notes or a key signature on a staff */
export type Visual = { kind: 'staff'; clef: 'treble' | 'bass'; notes: number[]; keySig?: number; /** notes sound together: draw them stacked */ stack?: boolean }

export type Question = {
  /** Usually the level's options; some games (rhythm) draw fresh choices per question */
  options: Option[]
  answer: string
  /** Sound of the question (may be empty for reading games) */
  prompt: Step[]
  /** Tonal context (cadence); replayable, played when the key changes */
  context?: Step[]
  key?: number
  /** Played right after answering (resolution, or the sound of what was read) */
  after?: Step[]
  /** Sound of any option, for "hear the difference" */
  hear(id: string): Step[]
  visual?: Visual
}

export type Level = {
  title: string
  skill: string
  options: Option[]
  /** Pip's explanation shown first in Learn */
  concept?: string
  /** Options introduced in this level (demonstrated in Learn) */
  fresh: string[]
  /** `key` lets arcades hold a key for a few turns */
  generate(rng: Rng, key?: number): Question
  demo(id: string): Step[]
  demoVisual?(id: string): Visual
  hint(id: string): string
  demoContext?: Step[]
  /** Arcades change key every N turns (any-key levels) */
  keyEvery?: number
}

export type GameId =
  | 'pitch' | 'tuneup' | 'intervals' | 'harmonic' | 'degrees' | 'scales' | 'contour' | 'spot'
  | 'chords' | 'progressions' | 'cadences' | 'rhythm' | 'meter' | 'timbre' | 'expression' | 'notes' | 'intreader' | 'keysigs'
export type CourseId = 'pitch' | 'intervals' | 'scales' | 'melody' | 'harmony' | 'rhythm' | 'sounds' | 'theory'
export type WorldId = 'garden' | 'space' | 'ocean' | 'mountains' | 'notebook'
export type Arcade = 'breaker' | 'blaster' | 'drops'

export type Game = {
  id: GameId
  course: CourseId
  title: string
  blurb: string
  instruction: string
  world: WorldId
  worldName: string
  arcade: Arcade
  /** Levels start this many Journey sections later (harder games join the Journey later) */
  journeyOffset?: number
  instruments: Inst[]
  levels: Level[]
}

/** New options of a level compared with the previous one */
export const freshOf = (ids: string[], prev?: string[]) => ids.filter((x) => !prev?.includes(x))
