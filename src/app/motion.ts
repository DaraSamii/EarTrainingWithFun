import { flushSync } from 'react-dom'

/**
 * Swap content with a soft crossfade: the old content fades out while the new fades in
 * (View Transitions API, `data-vt="soft"` picks the gentle style in screens.css).
 */
export function animate(update: () => void) {
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof document === 'undefined' || !document.startViewTransition || reduce) return update()
  document.documentElement.dataset.vt = 'soft'
  const t = document.startViewTransition(() => flushSync(update))
  void t.finished.finally(() => { delete document.documentElement.dataset.vt })
}
