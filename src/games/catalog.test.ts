import { describe, expect, test } from 'vitest'
import { ALL_IDS, COURSES, GAMES, JOURNEY, coursePath, currentNode, isUnlocked, levelId, resolution } from './catalog'
import { mulberry32 } from '../music/theory'
import { initialProgress, type Progress } from '../progress/progress'
import { melodyFor, shapeOf } from './defs/contour'

describe('every game level generates valid, reproducible questions', () => {
  for (const game of Object.values(GAMES)) {
    game.levels.forEach((level, i) => {
      test(`${game.id} level ${i + 1}`, () => {
        expect(level.options.length).toBeGreaterThanOrEqual(2)
        expect(level.options.length).toBeLessThanOrEqual(7)
        for (let s = 0; s < 150; s++) {
          const q = level.generate(mulberry32(s))
          expect(q.options.map((o) => o.id)).toContain(q.answer)
          // every question must be answerable: something to hear or to read
          expect(q.prompt.length > 0 || !!q.visual).toBe(true)
          for (const step of [...q.prompt, ...(q.context ?? []), ...(q.after ?? []), ...q.hear(q.answer)])
            step.notes.forEach((n) => {
              expect(n).toBeGreaterThanOrEqual(28)
              expect(n).toBeLessThanOrEqual(96)
            })
          expect(level.generate(mulberry32(s)).answer).toBe(q.answer)
        }
        for (const id of level.fresh) expect(level.options.map((o) => o.id)).toContain(id)
        for (const o of level.options) expect(level.demo(o.id).length).toBeGreaterThan(0)
      })
    })
  }
})

test('degree resolution walks to the nearest tonic', () => {
  const notes = (d: number) => resolution(60, d).map((s) => s.notes[0])
  expect(notes(1)).toEqual([60])
  expect(notes(3)).toEqual([64, 62, 60])
  expect(notes(5)).toEqual([67, 69, 71, 72])
  expect(notes(7)).toEqual([71, 72])
})

test('contour melodies follow their shape', () => {
  for (const c of ['uu', 'dd', 'udu', 'uudd', 'dduu']) {
    for (let s = 0; s < 50; s++) {
      const m = melodyFor(mulberry32(s), c, 3)
      ;[...c].forEach((d, i) => expect(Math.sign(m[i + 1] - m[i])).toBe(d === 'u' ? 1 : -1))
    }
  }
  expect(shapeOf('udu')).toEqual([0, 1, 0, 1])
})

test('journey and course paths cover every level exactly once', () => {
  const journey = JOURNEY.flatMap((u) => u.nodes.map(([g, l]) => levelId(g, l)))
  expect(new Set(journey).size).toBe(ALL_IDS.length)
  const courses = COURSES.flatMap((c) => coursePath(c).flatMap((u) => u.nodes.map(([g, l]) => levelId(g, l))))
  expect(courses.sort()).toEqual([...ALL_IDS].sort())
})

test('levels unlock one by one per game; current node is the first open unfinished one', () => {
  expect(isUnlocked(initialProgress, 'pitch', 0)).toBe(true)
  expect(isUnlocked(initialProgress, 'pitch', 1)).toBe(false)
  expect(currentNode(initialProgress, JOURNEY)).toEqual(JOURNEY[0].nodes[0])
  const p: Progress = { ...initialProgress, levels: { 'pitch:0': { best: 1, done: true, plays: 1 } } }
  expect(isUnlocked(p, 'pitch', 1)).toBe(true)
  expect(currentNode(p, JOURNEY)).toEqual(JOURNEY[0].nodes[1])
})
