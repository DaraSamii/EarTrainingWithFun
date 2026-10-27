export type Theme = 'system' | 'light' | 'dark'

export function applyTheme(t: Theme) {
  if (t === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = t
}

export function savedTheme(): Theme {
  try { return (localStorage.getItem('etwf.theme') as Theme) || 'light' } catch { return 'light' }
}

export function saveTheme(t: Theme) {
  applyTheme(t)
  try { localStorage.setItem('etwf.theme', t) } catch { /* private mode */ }
}

/** Theme actually showing right now (resolves "system") */
export const effectiveTheme = (t: Theme) => (t === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t)
