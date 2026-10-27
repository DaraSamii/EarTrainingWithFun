import { useState } from 'react'
import { effectiveTheme, saveTheme, savedTheme } from '../app/theme'
import { Icon } from './Icon'
import { en } from '../i18n/en'

export function ThemeToggle() {
  const [t, setT] = useState(() => effectiveTheme(savedTheme()))
  const next = t === 'dark' ? 'light' : 'dark'
  return (
    <button className="icon-btn theme-toggle" aria-label={en.theme[next]} title={en.theme[next]}
      onClick={() => { saveTheme(next); setT(next) }}>
      <Icon name={t === 'dark' ? 'sun' : 'moon'} />
    </button>
  )
}
