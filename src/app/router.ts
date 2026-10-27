import { useSyncExternalStore } from 'react'

// shortcut: hash routing avoids the GitHub Pages 404 fallback; switch to clean URLs (ADR-008) if SEO matters
const subscribe = (cb: () => void) => (addEventListener('hashchange', cb), () => removeEventListener('hashchange', cb))

export const useRoute = () => useSyncExternalStore(subscribe, () => location.hash.slice(1) || '/')
export const go = (path: string) => { location.hash = path }
