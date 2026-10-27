export type Theme = 'system' | 'light' | 'dark'

export function applyTheme(t: Theme) {
  if (t === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = t
}

export function savedTheme(): Theme {
  try { return (localStorage.getItem('etwf.theme') as Theme) || 'system' } catch { return 'system' }
}

export function saveTheme(t: Theme) {
  applyTheme(t)
  try { localStorage.setItem('etwf.theme', t) } catch { /* private mode */ }
}
