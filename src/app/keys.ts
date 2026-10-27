import { useEffect, useRef } from 'react'

type Keys = { next?: () => void; back?: () => void; exit?: () => void }

/** → next, ← back, Esc exit: the same keyboard moves on every screen (user feedback 0.6.0) */
export function useKeys(keys: Keys) {
  const ref = useRef(keys)
  useEffect(() => { ref.current = keys })
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return
      const k = ref.current
      const f = e.key === 'ArrowRight' ? k.next : e.key === 'ArrowLeft' ? k.back : e.key === 'Escape' ? k.exit : undefined
      if (f) { e.preventDefault(); f() }
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])
}
