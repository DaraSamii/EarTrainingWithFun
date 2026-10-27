import { expect, test } from 'vitest'
import { buildReview, interleave, practiceItems, questionFor } from './review'
import { JOURNEY, itemKey } from './catalog'
import { mulberry32 } from '../music/theory'
import { initialProgress, type Progress } from '../progress/progress'
import { remember } from '../progress/srs'

const today = '2026-10-30'

test('questionFor recreates a question with the remembered answer, searching lower levels', () => {
  const it = questionFor('intervals:TT', 7, mulberry32(1))
  expect(it?.q.answer).toBe('TT')
  expect(it?.level).toBe(6)
  expect(questionFor('chords:min', 0, mulberry32(2))?.q.answer).toBe('min')
  expect(questionFor('rhythm:L2', 2, mulberry32(3))?.level).toBe(2)
  expect(questionFor('nope:x', 0, mulberry32(3))).toBeNull()
})

test('interleave spreads games apart', () => {
  const mk = (g: 'pitch' | 'chords') => ({ q: {} as never, game: g, level: 0 })
  expect(interleave([mk('pitch'), mk('pitch'), mk('chords'), mk('chords')]).map((x) => x.game)).toEqual(['pitch', 'chords', 'pitch', 'chords'])
})

test('reviews pull due items; practice mixes in old due items from other levels', () => {
  const memory = remember({}, [
    { key: itemKey('intervals', 0, 'P5'), ok: true, lvl: 0 },
    { key: itemKey('chords', 0, 'maj'), ok: false, lvl: 0 },
    { key: itemKey('degrees', 0, '3'), ok: true, lvl: 0 },
  ], '2026-10-28')
  const p: Progress = { ...initialProgress, memory, levels: { 'intervals:0': { best: 1, done: true, plays: 1, learned: true } } }
  const r = buildReview(p, today, mulberry32(5))
  expect(r.map((x) => `${x.game}:${x.q.answer}`).sort()).toEqual(['chords:maj', 'degrees:3', 'intervals:P5'])
  const pr = practiceItems(p, 'intervals', 1, today, mulberry32(6))
  expect(pr).toHaveLength(8)
  expect(pr.filter((x) => x.review).length).toBe(2)
  expect(pr.slice(0, 3).every((x) => !x.review)).toBe(true)
})

test('unit reviews fall back to fresh questions from the unit', () => {
  const unit = JOURNEY[0]
  const levels = Object.fromEntries(unit.nodes.map(([g, l]) => [`${g}:${l}`, { best: 1, done: true, plays: 1, learned: true }]))
  const r = buildReview({ ...initialProgress, levels }, today, mulberry32(7), unit)
  expect(r).toHaveLength(10)
  for (const it of r) expect(unit.nodes.some(([g, l]) => g === it.game && l === it.level)).toBe(true)
})
