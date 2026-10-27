import { expect, test } from 'vitest'
import { progression, prettyProgression } from './harmony'

test('progressions put the root in the bass and keep upper voices in one octave', () => {
  const [I, IV, V] = progression(60, ['I', 'IV', 'V'])
  expect(I.notes).toEqual([48, 60, 64, 67])
  expect(IV.notes[0]).toBe(53)
  expect(V.notes[0]).toBe(55)
  for (const s of [I, IV, V]) for (const n of s.notes.slice(1)) expect(n >= 60 && n < 72).toBe(true)
  expect(prettyProgression('I IV V I')).toBe('I – IV – V – I')
})
