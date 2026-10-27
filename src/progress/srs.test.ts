import { expect, test } from 'vitest'
import { dueKeys, remember, strength, weakestKeys } from './srs'

const d0 = '2026-10-28'

test('a correct recall pushes the item further out each time', () => {
  let m = remember({}, [{ key: 'iv:P5', ok: true, lvl: 0 }], d0)
  expect(m['iv:P5']).toMatchObject({ box: 1, due: '2026-10-29', seen: 1 })
  m = remember(m, [{ key: 'iv:P5', ok: true, lvl: 1 }], '2026-10-29')
  expect(m['iv:P5']).toMatchObject({ box: 2, due: '2026-11-01', lvl: 1 })
  m = remember(m, [{ key: 'iv:P5', ok: true, lvl: 0 }], '2026-11-01')
  expect(m['iv:P5']).toMatchObject({ box: 3, due: '2026-11-08', lvl: 1 })
})

test('reviewing early does not earn a longer gap; a miss comes back tomorrow', () => {
  let m = remember({}, [{ key: 'k', ok: true, lvl: 0 }], d0)
  m = remember(m, [{ key: 'k', ok: true, lvl: 0 }], d0) // same day again: not due
  expect(m.k).toMatchObject({ box: 1, due: '2026-10-29' })
  m = remember(m, [{ key: 'k', ok: false, lvl: 0 }], d0)
  expect(m.k).toMatchObject({ box: 1, due: '2026-10-29', lapses: 1 })
})

test('each item counts once per session; due list is most overdue first', () => {
  const m = remember({}, [{ key: 'a', ok: true, lvl: 0 }, { key: 'a', ok: false, lvl: 0 }, { key: 'b', ok: false, lvl: 0 }], d0)
  expect(m.a.box).toBe(1)
  const later = { ...m, c: { box: 3, due: '2026-10-20', seen: 4, lapses: 0, lvl: 0 } }
  expect(dueKeys(later, '2026-10-29')).toEqual(['c', 'a', 'b'])
  expect(weakestKeys(later, '2026-10-28')).toEqual(['b', 'a'])
  expect(strength({ ...later, s: { box: 5, due: '2027-01-01', seen: 9, lapses: 0, lvl: 2 } })).toEqual({ total: 4, strong: 1 })
})
