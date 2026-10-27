import { useState } from 'react'
import { useProgress, setProgress } from '../../progress/store'
import { currentStreak, dayKey, initialProgress } from '../../progress/progress'
import { Icon } from '../../ui/Icon'
import { en } from '../../i18n/en'
import { savedTheme, saveTheme, type Theme } from '../../app/theme'

export function ProfileScreen() {
  const p = useProgress()
  const [theme, setTheme] = useState(savedTheme)
  const [armed, setArmed] = useState(false)
  const done = Object.values(p.levels).filter((l) => l.done).length

  const choose = (t: Theme) => {
    setTheme(t)
    saveTheme(t)
  }

  return (
    <div className="page">
      <h1>{en.profile.title}</h1>
      <div className="card profile-card">
        <span className="icon-mark" aria-hidden="true"><Icon name="profile" /></span>
        <div>
          <h2>{en.profile.guest}</h2>
          <p>{en.profile.guestHint}</p>
        </div>
        <button className="btn-dark" disabled>{en.profile.signIn}</button>
      </div>
      <div className="stat-grid">
        <div className="card stat-card"><Icon name="flame" /><strong>{currentStreak(p, dayKey())}</strong><span>{en.stats.streak}</span></div>
        <div className="card stat-card"><Icon name="bolt" /><strong>{p.xp}</strong><span>{en.stats.xp}</span></div>
        <div className="card stat-card"><Icon name="check" /><strong>{done}</strong><span>{en.profile.levelsDone}</span></div>
      </div>
      <div className="card settings">
        <h2>{en.profile.theme}</h2>
        <div className="segmented" role="radiogroup" aria-label={en.profile.theme}>
          {(['system', 'light', 'dark'] as const).map((t) => (
            <button key={t} role="radio" aria-checked={theme === t} onClick={() => choose(t)}>{en.profile.themes[t]}</button>
          ))}
        </div>
        <button className="btn-ghost danger" onClick={() => (armed ? (setProgress(initialProgress), setArmed(false)) : setArmed(true))}>
          {armed ? en.profile.resetConfirm : en.profile.reset}
        </button>
      </div>
    </div>
  )
}
