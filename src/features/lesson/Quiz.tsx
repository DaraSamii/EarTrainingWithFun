import { useEffect, useRef, useState } from 'react'
import { GAMES, itemKey, type Question } from '../../games/catalog'
import type { QuizItem } from '../../games/review'
import type { Answer } from '../../progress/srs'
import { isRunning, loadInstruments, play } from '../../audio/engine'
import { sfx } from '../../audio/sfx'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { Staff } from '../../ui/Staff'
import { OptionFace } from '../../ui/OptionFace'
import { ExitBar } from '../../ui/ExitBar'
import { World } from '../../ui/World'
import type { WorldId } from '../../games/types'
import { en } from '../../i18n/en'

const MAX_REQUEUE = 5
const GAP = { notes: [], dur: 0.5 }

const playQ = (q: Question, withContext: boolean) => play([...(withContext && q.context ? q.context : []), ...q.prompt])

export type QuizResult = { correct: number; total: number; answers: Answer[] }

/**
 * The calm question loop shared by Practice and Review: free replay, feedback and Continue right under the
 * answers, and every miss is asked again before the end (retrieval to criterion, ADR-022).
 */
export function Quiz({ start, label, world, back, onDone }: {
  start: QuizItem[]; label: string; world: WorldId; back: string; onDone(r: QuizResult): void
}) {
  const total = start.length
  const [items, setItems] = useState(() => start.map((it, n) => ({ ...it, n })))
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [firstTry, setFirstTry] = useState<boolean[]>([])
  const [right, setRight] = useState(0)
  const [combo, setCombo] = useState(0)
  const [needsTap, setNeedsTap] = useState(() => !isRunning() && start[0].q.prompt.length > 0)
  const feedbackRef = useRef<HTMLDivElement>(null)

  const { q, n, game: gid, review } = items[i]
  const game = GAMES[gid]
  const ok = picked === q.answer
  const audible = q.prompt.length > 0

  useEffect(() => { void loadInstruments([...new Set(start.flatMap((it) => GAMES[it.game].instruments))]) }, [start])
  // Play the first question once on mount; later questions play from the Continue click (inside the gesture).
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!needsTap) playQ(q, true) }, [])
  useEffect(() => { if (picked) feedbackRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [picked])

  function answer(id: string) {
    if (picked) return
    const correct = id === q.answer
    setPicked(id)
    if (firstTry[n] === undefined) setFirstTry((f) => Object.assign([...f], { [n]: correct }))
    setCombo((c) => (correct ? c + 1 : 0))
    if (correct) { sfx.pop(); setRight((r) => r + 1) }
    else {
      sfx.shield()
      if (items.length < total + MAX_REQUEUE) setItems((xs) => [...xs, items[i]])
    }
    play(q.after ?? (correct ? [] : q.hear(q.answer)))
  }

  function next() {
    if (i + 1 < items.length) {
      const nq = items[i + 1].q
      playQ(nq, nq.key !== q.key || items[i + 1].game !== gid)
      setPicked(null)
      setI(i + 1)
      return
    }
    const answers = start.map((it, k) => ({ key: itemKey(it.game, it.level, it.q.answer), ok: !!firstTry[k], lvl: it.level }))
    onDone({ correct: firstTry.filter(Boolean).length, total, answers })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === ' ') { e.preventDefault(); playQ(q, false) }
      else if (e.key === 'Escape') go(back)
      else if ((e.key === 'ArrowRight' || e.key === 'Enter') && picked) { e.preventDefault(); next() }
      else if (!picked && /^[1-9]$/.test(e.key)) { const o = q.options[+e.key - 1]; if (o) answer(o.id) }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  const text = (id: string) => {
    const o = q.options.find((x) => x.id === id)!
    return o.sub && !o.shape ? `${o.label} (${o.sub})` : o.label
  }

  return (
    <div className={`lesson world-bg-${world}`}>
      <div className="lesson-sky"><World world={world} /></div>
      <header className="lesson-top">
        <ExitBar back={back} onWorld />
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={right}>
          <span style={{ width: `${(Math.min(right, total) / total) * 100}%` }} />
        </div>
        <span className={`combo ${combo >= 3 ? 'on' : ''}`} aria-hidden={combo < 3}>
          <Icon name="flame" size={18} /> {combo} {en.lesson.combo}
        </span>
      </header>

      <section className="lesson-body" key={i}>
        <span className="tag">{label}</span>
        {review && <span className="review-chip"><Icon name="target" size={16} /> {en.review.chip} · {game.title}</span>}
        <h1>{game.instruction}</h1>
        <div className="listen">
          {q.visual && <div className="visual-card"><Staff v={q.visual} width={260} /></div>}
          {audible && (
            <button className="replay" aria-label={`${en.lesson.replay} (Space)`} onClick={() => playQ(q, false)}>
              <Icon name="play" size={44} />
            </button>
          )}
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
              <OptionFace o={o} />
            </button>
          ))}
        </div>

        {picked && (
          <div ref={feedbackRef} className={`feedback ${ok ? 'ok' : 'bad'}`} role="status">
            <span className="sheet-icon" aria-hidden="true"><Icon name={ok ? 'check' : 'close'} size={26} /></span>
            <div className="sheet-text">
              <strong>{ok ? en.lesson.correct[n % en.lesson.correct.length] : en.lesson.wrong}</strong>
              <p>{ok ? text(q.answer) : `${en.lesson.youChose} ${text(picked)}. ${en.lesson.itWas} ${text(q.answer)}.`}</p>
            </div>
            <div className="sheet-actions">
              {!ok && (
                <button className="btn-ghost" onClick={() => play([...q.hear(picked), GAP, ...q.hear(q.answer)])}>
                  <Icon name="volume" size={18} /> {en.lesson.hearDiff}
                </button>
              )}
              <button className="btn-dark" autoFocus onClick={next}>{en.lesson.continue} <Icon name="arrow" size={18} /></button>
            </div>
          </div>
        )}
      </section>

      {needsTap && (
        <button className="tap-overlay" onClick={() => { setNeedsTap(false); playQ(q, true) }}>
          <span className="replay" aria-hidden="true"><Icon name="play" size={44} /></span>
          {en.lesson.tapToStart}
        </button>
      )}
    </div>
  )
}
