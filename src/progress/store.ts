import { useSyncExternalStore } from 'react'
import { initialProgress, withBadges, type BadgeId, type Progress } from './progress'
import { JOURNEY, levelId } from '../games/catalog'

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

export const getProgress = () => state

export function setProgress(next: Progress) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode: keep in memory */ }
  listeners.forEach((l) => l())
}

/** Apply a change, award any newly earned badges, and return them (for the results screen) */
export function commit(change: (p: Progress) => Progress): BadgeId[] {
  const [next, fresh] = withBadges(change(state), JOURNEY[0].nodes.map(([g, l]) => levelId(g, l)))
  setProgress(next)
  return fresh
}

export const useProgress = () =>
  useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => state)
