import { expect, test } from 'vitest'
import { multiplier, points } from './score'

test('combo multiplier steps every 3 hits and caps at ×3', () => {
  expect([0, 2, 3, 5, 6, 9, 12, 30].map(multiplier)).toEqual([1, 1, 1.5, 1.5, 2, 2.5, 3, 3])
})

test('points reward speed and combo, clamp time left', () => {
  expect(points(0, 1)).toBe(100)
  expect(points(1, 1)).toBe(200)
  expect(points(0.5, 6)).toBe(300)
  expect(points(-1, 1)).toBe(100)
  expect(points(2, 1)).toBe(200)
})
