import { expect, test } from 'vitest'
import {
  addXp, setGoal, week, applyLearn, applyPlay, applyPractice, currentStreak, initialProgress, level, playXp, sessionXp, starsFor, withBadges,
} from './progress'

test('xp: 10 per session, 1 per correct, 5 for perfect; play adds 5 per star', () => {
  expect(sessionXp(7, 10)).toBe(17)
  expect(sessionXp(10, 10)).toBe(25)
  expect(playXp({ correct: 10, total: 10, score: 0, maxCombo: 0 })).toBe(40)
})

test('stars by first-try accuracy', () => {
  expect([0.5, 0.6, 0.79, 0.8, 0.94, 0.95, 1].map(starsFor)).toEqual([0, 1, 1, 2, 2, 3, 3])
})

test('streak grows on consecutive goal days, lapses after a gap, counts once per day', () => {
  let p = addXp(initialProgress, 25, '2026-10-30')
  expect(p.streak).toBe(1)
  p = addXp(p, 25, '2026-10-30')
  expect(p.streak).toBe(1)
  p = addXp(p, 25, '2026-10-31') // across a month boundary
  expect(p.streak).toBe(2)
  p = addXp(p, 25, '2026-11-01')
  expect(p.streak).toBe(3)
  expect(currentStreak(p, '2026-11-02')).toBe(3)
  expect(currentStreak(p, '2026-11-03')).toBe(0)
  p = addXp(p, 25, '2026-11-03')
  expect(p.streak).toBe(1)
})

test('goal not met: no streak; today xp resets on a new day', () => {
  let p = addXp(initialProgress, 12, '2026-10-30')
  expect(p.streak).toBe(0)
  p = addXp(p, 12, '2026-10-31')
  expect(p.todayXp).toBe(12)
})

test('learn → practice → play gating data', () => {
  let p = applyLearn(initialProgress, 'x', '2026-10-30')
  expect(level(p, 'x').learned).toBe(true)
  expect(applyLearn(p, 'x', '2026-10-30').xp).toBe(p.xp) // learn XP only once
  p = applyPractice(p, 'x', 6, 8, '2026-10-30')
  expect(level(p, 'x')).toMatchObject({ learned: true, practiced: true, done: false })
  p = applyPlay(p, 'x', { correct: 7, total: 10, score: 900, maxCombo: 4 }, '2026-10-30')
  expect(level(p, 'x')).toMatchObject({ stars: 1, done: false, plays: 1, hiScore: 900 })
  p = applyPlay(p, 'x', { correct: 10, total: 10, score: 2000, maxCombo: 10 }, '2026-10-30')
  p = applyPlay(p, 'x', { correct: 5, total: 10, score: 100, maxCombo: 1 }, '2026-10-30')
  expect(level(p, 'x')).toMatchObject({ stars: 3, done: true, plays: 3, hiScore: 2000, best: 1 })
  expect(p.bestCombo).toBe(10)
})

test('badges are awarded once and kept', () => {
  let p = applyPlay(applyLearn(initialProgress, 'a', '2026-10-30'), 'a', { correct: 10, total: 10, score: 1, maxCombo: 10 }, '2026-10-30')
  const [p2, fresh] = withBadges(p, ['a', 'b'])
  expect(fresh).toEqual(['firstLearn', 'firstPlay', 'triple', 'combo10'])
  expect(withBadges(p2, ['a', 'b'])[1]).toEqual([])
  p = applyPlay(p2, 'b', { correct: 9, total: 10, score: 1, maxCombo: 1 }, '2026-10-30')
  expect(withBadges(p, ['a', 'b'])[1]).toEqual(['sectionA'])
})

test('xp history per day feeds the week view and trims old days', () => {
  let p = addXp(initialProgress, 12, '2026-09-01')
  p = addXp(p, 8, '2026-10-26') // Monday
  p = addXp(p, 5, '2026-10-28')
  p = addXp(p, 5, '2026-10-28')
  expect(p.xpDays['2026-09-01']).toBeUndefined()
  const w = week(p, '2026-10-28')
  expect(w.map((d) => d.day)).toEqual(['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01'])
  expect(w.map((d) => d.xp)).toEqual([8, 0, 10, 0, 0, 0, 0])
  expect(w.map((d) => d.future)).toEqual([false, false, false, true, true, true, true])
  expect(setGoal(p, 50).dailyGoal).toBe(50)
})
