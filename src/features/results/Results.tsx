import { useEffect, useState } from 'react'
import type { GameId } from '../../games/catalog'
import type { WorldId } from '../../games/types'
import type { BadgeId } from '../../progress/progress'
import { sfx } from '../../audio/sfx'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { Pip, Bubble } from '../../ui/Pip'
import { Stars } from '../../ui/Stars'
import { Confetti } from '../../ui/Confetti'
import { Badge } from '../../ui/Badge'
import { ExitBar } from '../../ui/ExitBar'
import { en } from '../../i18n/en'

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      setV(Math.round(target * (1 - (1 - k) ** 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

type Props = {
  kind: 'practice' | 'play' | 'review'
  gameId?: GameId
  level?: number
  world: WorldId
  /** where Continue / Back lead */
  back: string
  correct: number
  total: number
  xp: number
  score?: number
  maxCombo?: number
  stars?: number
  newBest?: boolean
  badges: BadgeId[]
  again(): void
}

export function Results({ kind, gameId, level, world, back, correct, total, xp, score = 0, maxCombo = 0, stars = 0, newBest, badges, again }: Props) {
  const shown = useCountUp(score)
  const shownXp = useCountUp(xp, 700)
  const acc = Math.round((correct / total) * 100)
  const celebrate = kind === 'practice' || (kind === 'review' ? acc >= 80 : stars >= 2)
  useEffect(() => { if (celebrate) sfx.cheer() }, [celebrate])

  const title = kind === 'practice' ? en.results.practiceDone : kind === 'review' ? en.review.done : en.results.title[stars]
  const line = kind === 'practice' ? en.results.playUnlocked
    : kind === 'review' ? (acc >= 80 ? en.review.strong : en.review.again)
    : stars >= 2 ? en.results.levelDone : en.results.needStars

  return (
    <div className={`results world-bg-${world}`}>
      <div className="results-exit"><ExitBar back={back} /></div>
      {celebrate && <Confetti />}
      <span className="shape deco pentagon right" aria-hidden="true" />
      <span className="shape deco circle left" aria-hidden="true" />
      <div className="results-card">
        <div className="pip-stage">
          <Pip mood={celebrate ? 'happy' : 'think'} size={120} />
          <Bubble side="bottom"><p>{line}</p></Bubble>
        </div>
        <h1>{title}</h1>
        {kind === 'play' && <Stars n={stars} size={52} pop />}
        <div className="stat-grid">
          {kind === 'play' && (
            <div className="card stat-card tone-score">
              <Icon name="star" /><strong>{shown}</strong><span>{newBest ? en.results.newBest : en.results.score}</span>
            </div>
          )}
          <div className="card stat-card"><Icon name="target" /><strong>{acc}%</strong><span>{en.results.accuracy}</span></div>
          <div className="card stat-card tone-xp"><Icon name="bolt" /><strong>+{shownXp}</strong><span>{en.results.xp}</span></div>
          {kind === 'play' && maxCombo > 1 && (
            <div className="card stat-card tone-streak"><Icon name="flame" /><strong>{maxCombo}</strong><span>{en.results.combo}</span></div>
          )}
          {kind === 'review' && (
            <div className="card stat-card tone-streak"><Icon name="book" /><strong>{total}</strong><span>{en.review.refreshed}</span></div>
          )}
        </div>
        {badges.map((b) => (
          <div key={b} className="badge-toast" role="status">
            <Badge id={b} earned size={56} />
            <div><span className="tag">{en.results.badge}</span><strong>{en.badges[b][0]}</strong></div>
          </div>
        ))}
        <div className="actions">
          <button className="btn-ghost" onClick={again}>
            {kind === 'practice' ? en.results.againPractice : kind === 'review' ? en.review.more : en.results.again}
          </button>
          {kind === 'practice' && gameId ? (
            <button className="btn-primary" autoFocus onClick={() => go(`/play/${gameId}/${level}`)}>
              {en.level.go.play} <Icon name="gamepad" size={20} />
            </button>
          ) : (
            <button className="btn-primary" autoFocus onClick={() => go(back)}>
              {en.results.toLevel} <Icon name="arrow" size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
