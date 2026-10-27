import { useSyncExternalStore } from 'react'
import { initialProgress, type Progress } from './progress'

// shortcut: progress lives in localStorage only; move to Firestore with anonymous→Google auth in 0.4.0 (ADR-002)
const KEY = 'etwf.progress.v1'

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...initialProgress, ...JSON.parse(raw) } : initialProgress
  } catch {
    return initialProgress
  }
}

let state = load()
const listeners = new Set<() => void>()

export function setProgress(next: Progress) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode: keep in memory */ }
  listeners.forEach((l) => l())
}

export const useProgress = () =>
  useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => state)
