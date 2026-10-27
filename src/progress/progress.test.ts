import { expect, test } from 'vitest'
import { applySession, currentStreak, initialProgress, sessionXp } from './progress'

test('xp: 10 per session, 1 per correct, 5 for perfect', () => {
  expect(sessionXp(7, 10)).toBe(17)
  expect(sessionXp(10, 10)).toBe(25)
})

test('streak grows on consecutive goal days, lapses after a gap, counts once per day', () => {
  let p = applySession(initialProgress, 'a', 10, 10, '2026-10-30')
  expect(p.streak).toBe(1)
  p = applySession(p, 'a', 10, 10, '2026-10-30')
  expect(p.streak).toBe(1)
  p = applySession(p, 'a', 10, 10, '2026-10-31') // across a month boundary
  expect(p.streak).toBe(2)
  p = applySession(p, 'a', 10, 10, '2026-11-01')
  expect(p.streak).toBe(3)
  expect(currentStreak(p, '2026-11-02')).toBe(3)
  expect(currentStreak(p, '2026-11-03')).toBe(0)
  p = applySession(p, 'a', 10, 10, '2026-11-03')
  expect(p.streak).toBe(1)
})

test('goal not met: no streak; today xp resets on a new day', () => {
  let p = applySession(initialProgress, 'a', 2, 10, '2026-10-30') // 12 xp < 20
  expect(p.streak).toBe(0)
  p = applySession(p, 'a', 2, 10, '2026-10-31')
  expect(p.todayXp).toBe(12)
})

test('level done at 80%, best accuracy kept', () => {
  let p = applySession(initialProgress, 'x', 7, 10, '2026-10-30')
  expect(p.levels.x).toEqual({ best: 0.7, done: false, plays: 1 })
  p = applySession(p, 'x', 8, 10, '2026-10-30')
  p = applySession(p, 'x', 5, 10, '2026-10-30')
  expect(p.levels.x).toEqual({ best: 0.8, done: true, plays: 3 })
})
