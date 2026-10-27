import { useEffect, useState } from 'react'
import { useLater } from './hooks'
import { multiplier } from '../../games/score'
import { sfx } from '../../audio/sfx'
import { Icon } from '../../ui/Icon'
import { Pip, Bubble } from '../../ui/Pip'
import { ExitBar } from '../../ui/ExitBar'
import { useKeys } from '../../app/keys'
import { Rich } from '../../ui/Rich'
import { en } from '../../i18n/en'

export type Popup = { id: number; x: number; y: number; text: string; kind: 'good' | 'bad' }

export function Popups({ items }: { items: Popup[] }) {
  return <>{items.map((p) => <span key={p.id} className={`popup ${p.kind}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>{p.text}</span>)}</>
}

export function Hud({ total, results, score, combo, back, onReplay, onHelp }: {
  total: number; results: boolean[]; score: number; combo: number; back: string; onReplay?(): void; onHelp?(): void
}) {
  const m = multiplier(combo)
  return (
    <header className="hud">
      <ExitBar back={back} onWorld />
      <ol className="segments" aria-label={`${results.length} / ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <li key={i} className={i < results.length ? (results[i] ? 'ok' : 'bad') : ''} />
        ))}
      </ol>
      <span className={`mult ${m > 1 ? 'on' : ''}`} key={m}>×{m}</span>
      <span className="score" aria-label={en.arcade.score}><Icon name="star" size={16} /> {score}</span>
      {onHelp && <button className="icon-btn on-world help-btn" aria-label={en.arcade.howTo} title={en.arcade.howTo} onClick={onHelp}>?</button>}
      {onReplay && <button className="icon-btn on-world" aria-label={`${en.arcade.replay} (Space)`} onClick={onReplay}><Icon name="volume" /></button>}
    </header>
  )
}

export function StartOverlay({ title, text, help, onStart }: { title: string; text: string; help: string[]; onStart(): void }) {
  useKeys({ next: onStart })
  return (
    <div className="overlay">
      <div className="overlay-card">
        <Pip mood="talk" size={110} />
        <Bubble side="bottom"><p><Rich text={text} /></p></Bubble>
        <h2>{title}</h2>
        <ul className="how-to">{help.map((h) => <li key={h}>{h}</li>)}</ul>
        <button className="btn-primary big" autoFocus onClick={onStart}>{en.arcade.ready} <Icon name="play" size={20} /></button>
      </div>
    </div>
  )
}

/** 3 · 2 · 1 · Go! */
export function Countdown({ onDone }: { onDone(): void }) {
  const [n, setN] = useState(3)
  const later = useLater()
  useEffect(() => {
    sfx.tick()
    later(650, () => { setN(2); sfx.tick() })
    later(1300, () => { setN(1); sfx.tick() })
    later(1950, () => { setN(0); sfx.whoosh() })
    later(2450, onDone)
  }, []) // oxlint-disable-line react-hooks/exhaustive-deps -- run once on mount
  return <div className="countdown" aria-live="assertive"><span key={n} className={n ? '' : 'go'}>{n || en.arcade.go}</span></div>
}
