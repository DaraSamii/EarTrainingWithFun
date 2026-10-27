import { useState } from 'react'
import { GAMES, levelId, type GameId } from '../../games/catalog'
import { practiceItems } from '../../games/review'
import { mulberry32 } from '../../music/theory'
import { commit, getProgress } from '../../progress/store'
import { applyPractice, dayKey, sessionXp, type BadgeId } from '../../progress/progress'
import { Results } from '../results/Results'
import { Quiz, type QuizResult } from './Quiz'
import { passMark } from '../../app/settings'
import { en } from '../../i18n/en'

type Props = { gameId: GameId; level: number }

/** Practice: the calm round between Learn and Play, with a few older due items mixed in (ADR-013, ADR-022) */
export function LessonScreen({ gameId, level }: Props) {
  const build = () => practiceItems(getProgress(), gameId, level, dayKey(), mulberry32(Date.now()))
  const [run, setRun] = useState(0)
  const [items, setItems] = useState(build)
  const [res, setRes] = useState<(QuizResult & { badges: BadgeId[] }) | null>(null)
  const game = GAMES[gameId]
  const back = `/level/${gameId}/${level}`

  if (res)
    return <Results kind="practice" gameId={gameId} level={level} world={game.world} back={back} correct={res.correct} total={res.total}
      xp={sessionXp(res.correct, res.total)} badges={res.badges} again={() => { setItems(build()); setRes(null); setRun((r) => r + 1) }} />

  return (
    <Quiz key={run} start={items} world={game.world} back={back}
      label={`${en.lesson.practice} · ${game.title} · ${en.path.level} ${level + 1}`}
      onDone={(r) => {
        // only this level's questions count toward its practice score; all answers feed memory
        const badges = commit((p) => applyPractice(p, levelId(gameId, level), r.correct, r.total, dayKey(), r.answers, passMark()))
        setRes({ ...r, badges })
      }} />
  )
}
