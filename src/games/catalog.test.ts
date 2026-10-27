import { describe, expect, test } from 'vitest'
import { GAMES, PATH, resolution } from './catalog'
import { mulberry32 } from '../music/theory'

describe('game generators', () => {
  for (const game of Object.values(GAMES)) {
    game.levels.forEach((level, i) => {
      test(`${game.id} level ${i + 1}: answer is an option, notes in range, deterministic`, () => {
        for (let s = 0; s < 200; s++) {
          const q = level.generate(mulberry32(s))
          expect(q.options.map((o) => o.id)).toContain(q.answer)
          for (const step of [...q.prompt, ...(q.context ?? [])])
            step.notes.forEach((n) => {
              expect(n).toBeGreaterThanOrEqual(36)
              expect(n).toBeLessThanOrEqual(90)
            })
          expect(level.generate(mulberry32(s)).answer).toBe(q.answer)
        }
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

test('path references only existing levels', () => {
  for (const u of PATH) for (const [g, l] of u.nodes) expect(GAMES[g].levels[l]).toBeDefined()
})
