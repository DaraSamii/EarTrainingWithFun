import { useState } from 'react'
import { useProgress, setProgress } from '../../progress/store'
import { BADGES, currentStreak, dayKey, initialProgress, totalStars } from '../../progress/progress'
import { Icon } from '../../ui/Icon'
import { Pip } from '../../ui/Pip'
import { Badge } from '../../ui/Badge'
import { en } from '../../i18n/en'
import { savedTheme, saveTheme, type Theme } from '../../app/theme'
import { setSfx, useSfx } from '../../app/settings'

export function ProfileScreen() {
  const p = useProgress()
  const sfxOn = useSfx()
  const [theme, setTheme] = useState(savedTheme)
  const [armed, setArmed] = useState(false)
  const done = Object.values(p.levels).filter((l) => l.done).length

  return (
    <div className="page">
      <h1>{en.profile.title}</h1>
      <div className="card profile-card">
        <span className="avatar"><Pip mood="happy" size={72} /></span>
        <div>
          <h2>{en.profile.guest}</h2>
          <p>{en.profile.guestHint}</p>
        </div>
        <button className="btn-dark" disabled>{en.profile.signIn}</button>
      </div>
      <div className="stat-grid four">
        <div className="card stat-card tone-streak"><Icon name="flame" /><strong>{currentStreak(p, dayKey())}</strong><span>{en.stats.streak}</span></div>
        <div className="card stat-card tone-xp"><Icon name="bolt" /><strong>{p.xp}</strong><span>{en.stats.xp}</span></div>
        <div className="card stat-card tone-score"><Icon name="star" /><strong>{totalStars(p)}</strong><span>{en.home.starsTitle}</span></div>
        <div className="card stat-card"><Icon name="check" /><strong>{done}</strong><span>{en.profile.levelsDone}</span></div>
      </div>

      <section className="card">
        <h2>{en.profile.badges} <small className="count">{p.badges.length}/{BADGES.length}</small></h2>
        <ul className="badge-grid">
          {BADGES.map((b) => {
            const earned = p.badges.includes(b)
            return (
              <li key={b} className={earned ? 'earned' : ''}>
                <Badge id={b} earned={earned} />
                <strong>{en.badges[b][0]}</strong>
                <span>{en.badges[b][1]}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="card settings">
        <h2>{en.profile.settings}</h2>
        <div className="setting">
          <span>{en.profile.theme}</span>
          <div className="segmented" role="radiogroup" aria-label={en.profile.theme}>
            {(['system', 'light', 'dark'] as Theme[]).map((t) => (
              <button key={t} role="radio" aria-checked={theme === t} onClick={() => { setTheme(t); saveTheme(t) }}>{en.profile.themes[t]}</button>
            ))}
          </div>
        </div>
        <div className="setting">
          <span>{en.profile.sfx}</span>
          <div className="segmented" role="radiogroup" aria-label={en.profile.sfx}>
            {[true, false].map((on) => (
              <button key={String(on)} role="radio" aria-checked={sfxOn === on} onClick={() => setSfx(on)}>{on ? en.profile.on : en.profile.off}</button>
            ))}
          </div>
        </div>
        <button className="btn-ghost danger" onClick={() => (armed ? (setProgress(initialProgress), setArmed(false)) : setArmed(true))}>
          {armed ? en.profile.resetConfirm : en.profile.reset}
        </button>
      </section>
    </div>
  )
}
