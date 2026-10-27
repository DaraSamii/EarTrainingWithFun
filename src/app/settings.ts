import { useSyncExternalStore } from 'react'

const KEY = 'etwf.sfx'
const listeners = new Set<() => void>()

export function sfxOn() {
  try { return localStorage.getItem(KEY) !== 'off' } catch { return true }
}

export function setSfx(on: boolean) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off') } catch { /* private mode */ }
  listeners.forEach((l) => l())
}

export const useSfx = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), sfxOn)
