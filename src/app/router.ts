import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

// shortcut: hash routing avoids the GitHub Pages 404 fallback; switch to clean URLs (ADR-008) if SEO matters

/**
 * Route changes run inside a View Transition: the old page fades out while the new one fades in
 * (styles in screens.css). flushSync renders the new route synchronously inside the transition.
 */
const subscribe = (cb: () => void) => {
  const onChange = () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (document.startViewTransition && !reduce) document.startViewTransition(() => flushSync(cb))
    else cb()
  }
  addEventListener('hashchange', onChange)
  return () => removeEventListener('hashchange', onChange)
}

/** Current route path, without any ?query */
export const useRoute = () => useSyncExternalStore(subscribe, () => (location.hash.slice(1) || '/').split('?')[0])
export const go = (path: string) => { location.hash = path }

/** Where a level was opened from (`?from=`), so "back" returns there; defaults to Home */
export const fromParam = () => new URLSearchParams(location.hash.split('?')[1] ?? '').get('from') ?? '/'
