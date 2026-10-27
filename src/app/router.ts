import { useSyncExternalStore } from 'react'

// shortcut: hash routing avoids the GitHub Pages 404 fallback; switch to clean URLs (ADR-008) if SEO matters
const subscribe = (cb: () => void) => (addEventListener('hashchange', cb), () => removeEventListener('hashchange', cb))

/** Current route path, without any ?query */
export const useRoute = () => useSyncExternalStore(subscribe, () => (location.hash.slice(1) || '/').split('?')[0])
export const go = (path: string) => { location.hash = path }

/** Where a level was opened from (`?from=`), so "back" returns there; defaults to Home */
export const fromParam = () => new URLSearchParams(location.hash.split('?')[1] ?? '').get('from') ?? '/'
