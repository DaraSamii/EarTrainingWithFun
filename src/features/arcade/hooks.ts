import { useEffect, useRef } from 'react'

/** setTimeout that is cleared automatically when the game unmounts */
export function useLater() {
  const ids = useRef(new Set<number>())
  useEffect(() => () => ids.current.forEach(clearTimeout), [])
  return (ms: number, f: () => void) => {
    const id = window.setTimeout(() => { ids.current.delete(id); f() }, ms)
    ids.current.add(id)
  }
}

/** Mutable game state for rAF loops; the component re-renders on demand, not per frame */
export function useGame<T>(init: () => T): T {
  const ref = useRef<T | null>(null)
  ref.current ??= init()
  return ref.current
}
