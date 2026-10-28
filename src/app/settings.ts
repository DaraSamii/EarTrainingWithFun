import { useSyncExternalStore } from 'react'

const SFX = 'etwf.sfx'
const PASS_KEY = 'etwf.pass'
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const sub = (l: () => void) => (listeners.add(l), () => listeners.delete(l))

export function sfxOn() {
  try { return localStorage.getItem(SFX) !== 'off' } catch { return true }
}

export function setSfx(on: boolean) {
  try { localStorage.setItem(SFX, on ? 'on' : 'off') } catch { /* private mode */ }
  notify()
}

export const useSfx = () => useSyncExternalStore(sub, sfxOn)

/** Passing score for Practice, Play and unit reviews, chosen in Profile (default 80%) */
export const PASS_CHOICES = [0.6, 0.7, 0.8, 0.9]

export function passMark() {
  try {
    const v = Number(localStorage.getItem(PASS_KEY))
    return PASS_CHOICES.includes(v) ? v : 0.8
  } catch { return 0.8 }
}

export function setPassMark(v: number) {
  try { localStorage.setItem(PASS_KEY, String(v)) } catch { /* private mode */ }
  notify()
}

export const usePassMark = () => useSyncExternalStore(sub, passMark)

/** Whether the Welcome page has been seen (it shows on a first visit) */
export const WELCOMED = 'etwf.welcomed'
export const welcomed = () => { try { return !!localStorage.getItem(WELCOMED) } catch { return true } }
