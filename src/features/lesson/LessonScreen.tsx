import { useEffect, useState } from 'react'
import { GAMES, levelId, type GameId, type Question } from '../../games/catalog'
import { mulberry32 } from '../../music/theory'
import { isRunning, play } from '../../audio/engine'
import { useProgress, setProgress } from '../../progress/store'
import { applySession, currentStreak, dayKey, PASS } from '../../progress/progress'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { en } from '../../i18n/en'

const SESSION = 10
const MAX_REQUEUE = 5
const GAP = { notes: [], dur: 0.5 }

type Props = { gameId: GameId; level: number }

const playQ = (q: Question, withContext: boolean) => play([...(withContext && q.context ? q.context : []), ...q.prompt])

export function LessonScreen(props: Props) {
  const [run, setRun] = useState(0)
  return <Lesson key={run} {...props} retry={() => setRun((r) => r + 1)} />
}

function Lesson({ gameId, level, retry }: Props & { retry(): void }) {
  const game = GAMES[gameId]
  const p = useProgress()
  const [items, setItems] = useState(() => {
    const rng = mulberry32(Date.now())
    return Array.from({ length: SESSION }, (_, n) => ({ q: game.levels[level].generate(rng), n }))
  })
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [firstTry, setFirstTry] = useState<boolean[]>([])
  const [right, setRight] = useState(0)
  const [combo, setCombo] = useState(0)
  const [needsTap, setNeedsTap] = useState(() => !isRunning())
  const [summary, setSummary] = useState<{ correct: number; xp: number; streak: number } | null>(null)

  const { q, n } = items[i]
  const ok = picked === q.answer

  // Play the first question once on mount; later questions play from the Continue click (inside the gesture).
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!needsTap) playQ(q, true) }, [])

  function answer(id: string) {
    if (picked) return
    const correct = id === q.answer
    setPicked(id)
    if (firstTry[n] === undefined) setFirstTry((f) => Object.assign([...f], { [n]: correct }))
    setCombo((c) => (correct ? c + 1 : 0))
    if (correct) setRight((r) => r + 1)
    else if (items.length < SESSION + MAX_REQUEUE) setItems((xs) => [...xs, items[i]])
    play(q.after ?? (correct ? [] : q.hear(q.answer)))
  }

  function next() {
    if (i + 1 < items.length) {
      const nq = items[i + 1].q
      playQ(nq, nq.key !== q.key)
      setPicked(null)
      setI(i + 1)
      return
    }
    const correct = firstTry.filter(Boolean).length
    const today = dayKey()
    const after = applySession(p, levelId(gameId, level), correct, SESSION, today)
    setProgress(after)
    setSummary({ correct, xp: after.xp - p.xp, streak: currentStreak(after, today) })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (summary || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === ' ') { e.preventDefault(); playQ(q, false) }
      else if (e.key === 'Escape') go('/')
      else if (!picked && /^[1-9]$/.test(e.key)) { const o = q.options[+e.key - 1]; if (o) answer(o.id) }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  if (summary) return <Summary {...summary} retry={retry} />

  const label = (id: string) => {
    const o = q.options.find((x) => x.id === id)!
    return gameId === 'degrees' ? `${o.label} (${o.sub})` : o.label
  }

  return (
    <div className="lesson">
      <header className="lesson-top">
        <button className="icon-btn" aria-label={en.lesson.exit} onClick={() => go('/')}><Icon name="close" /></button>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={SESSION} aria-valuenow={right}>
          <span style={{ width: `${(Math.min(right, SESSION) / SESSION) * 100}%` }} />
        </div>
        <span className={`combo ${combo >= 3 ? 'on' : ''}`} aria-hidden={combo < 3}>
          <Icon name="flame" size={18} /> {combo} {en.lesson.combo}
        </span>
      </header>

      <section className="lesson-body">
        <span className="tag">{game.title} · {en.path.level} {level + 1}</span>
        <h1>{game.instruction}</h1>
        <div className="listen">
          <button className="replay" aria-label={`${en.lesson.replay} (Space)`} onClick={() => playQ(q, false)}>
            <Icon name="play" size={44} />
          </button>
          {q.context && (
            <button className="btn-soft" onClick={() => play(q.context!)}>
              <Icon name="key" size={18} /> {en.lesson.key}
            </button>
          )}
        </div>
        <div className="answers" data-count={q.options.length}>
          {q.options.map((o, k) => (
            <button key={o.id} onClick={() => answer(o.id)} aria-disabled={!!picked}
              className={`answer ${picked ? (o.id === q.answer ? 'is-correct' : o.id === picked ? 'is-wrong' : 'is-dim') : ''}`}>
              <kbd aria-hidden="true">{k + 1}</kbd>
              <span className="answer-label">{o.label}</span>
              {o.sub && <span className="answer-sub">{o.sub}</span>}
            </button>
          ))}
        </div>
      </section>

      {picked && <Feedback ok={ok} q={q} picked={picked} label={label} next={next} />}

      {needsTap && (
        <button className="tap-overlay" onClick={() => { setNeedsTap(false); playQ(q, true) }}>
          <span className="replay" aria-hidden="true"><Icon name="play" size={44} /></span>
          {en.lesson.tapToStart}
        </button>
      )}
    </div>
  )
}

function Feedback({ ok, q, picked, label, next }: { ok: boolean; q: Question; picked: string; label(id: string): string; next(): void }) {
  const [praise] = useState(() => en.lesson.correct[Math.floor(Math.random() * en.lesson.correct.length)])
  return (
    <div className={`sheet ${ok ? 'ok' : 'bad'}`} role="status">
      <div className="sheet-inner">
        <span className="sheet-icon" aria-hidden="true"><Icon name={ok ? 'check' : 'close'} size={28} /></span>
        <div className="sheet-text">
          <strong>{ok ? praise : en.lesson.wrong}</strong>
          <p>{ok ? label(q.answer) : `${en.lesson.youChose} ${label(picked)}. ${en.lesson.itWas} ${label(q.answer)}.`}</p>
        </div>
        <div className="sheet-actions">
          {!ok && (
            <button className="btn-ghost" onClick={() => play([...q.hear(picked), GAP, ...q.hear(q.answer)])}>
              {en.lesson.hearDiff}
            </button>
          )}
          <button className="btn-dark" autoFocus onClick={next}>{en.lesson.continue}</button>
        </div>
      </div>
    </div>
  )
}

function Summary({ correct, xp, streak, retry }: { correct: number; xp: number; streak: number; retry(): void }) {
  const passed = correct / SESSION >= PASS
  return (
    <div className="summary">
      <span className="shape deco pentagon right" aria-hidden="true" />
      <span className="shape deco circle left" aria-hidden="true" />
      <div className="summary-card">
        <span className="icon-mark big" aria-hidden="true"><Icon name={passed ? 'check' : 'ear'} size={36} /></span>
        <h1>{passed ? en.summary.passed : en.summary.failed}</h1>
        {!passed && <p>{en.summary.failedHint}</p>}
        <div className="stat-grid">
          <div className="card stat-card tone-xp"><Icon name="bolt" /><strong>+{xp}</strong><span>{en.summary.xp}</span></div>
          <div className="card stat-card"><Icon name="check" /><strong>{Math.round((correct / SESSION) * 100)}%</strong><span>{en.summary.accuracy}</span></div>
          <div className="card stat-card tone-streak"><Icon name="flame" /><strong>{streak}</strong><span>{en.summary.streak}</span></div>
        </div>
        <div className="actions">
          <button className="btn-ghost" onClick={retry}>{en.summary.again}</button>
          <button className="btn-primary" autoFocus onClick={() => go('/')}>{en.summary.next} <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </div>
  )
}
