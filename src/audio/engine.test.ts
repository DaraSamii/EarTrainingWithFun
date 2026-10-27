import { expect, test } from 'vitest'
import { sampleMidi } from './engine'

test('sample file names map to MIDI', () => {
  expect(sampleMidi('A4')).toBe(69)
  expect(sampleMidi('C4')).toBe(60)
  expect(sampleMidi('Ds2')).toBe(39)
  expect(sampleMidi('As1')).toBe(34)
})
