import { useState } from 'react'
import { findUnit } from '../../games/catalog'
import { buildReview } from '../../games/review'
import { mulberry32 } from '../../music/theory'
import { commit, getProgress } from '../../progress/store'
import { applyReview, dayKey, reviewXp, type BadgeId } from '../../progress/progress'
import { Results } from '../results/Results'
import { Quiz, type QuizResult } from '../lesson/Quiz'
import { Pip, Bubble } from '../../ui/Pip'
import { ExitBar } from '../../ui/ExitBar'
import { go } from '../../app/router'
import { en } from '../../i18n/en'

/** Spaced review: everything due (`due`) or one unit's mix (`j3-2`, `c-pitch-2-1`) (ADR-022) */
export function ReviewScreen({ scope }: { scope: string }) {
  const unit = scope === 'due' ? undefined : findUnit(scope)
  const back = '/'
  const build = () => buildReview(getProgress(), dayKey(), mulberry32(Date.now()), unit)
  const [run, setRun] = useState(0)
  const [start, setStart] = useState(build)
  const [res, setRes] = useState<(QuizResult & { badges: BadgeId[] }) | null>(null)
  const label = unit ? `${en.review.unit} · ${unit.tag}` : en.review.title

  if (!start.length)
    return (
      <div className="results world-bg-garden">
        <div className="results-exit"><ExitBar /></div>
        <div className="results-card">
          <div className="pip-stage"><Pip mood="happy" size={120} /><Bubble side="bottom"><p>{en.review.nothing}</p></Bubble></div>
          <button className="btn-primary big" onClick={() => go('/')}>{en.results.toLevel}</button>
        </div>
      </div>
    )

  if (res)
    return <Results kind="review" world="garden" back={back} correct={res.correct} total={res.total} xp={reviewXp(res.correct, res.total)}
      badges={res.badges} again={() => { setStart(build()); setRes(null); setRun((r) => r + 1) }} />

  return (
    <Quiz key={run} start={start} world="garden" back={back} label={label}
      onDone={(r) => {
        const badges = commit((p) => applyReview(p, unit?.key ?? null, r.correct, r.total, dayKey(), r.answers))
        setRes({ ...r, badges })
      }} />
  )
}
