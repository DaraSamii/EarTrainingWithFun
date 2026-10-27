import { useEffect, useState } from 'react'
import { GAMES, levelId, type GameId } from '../../games/catalog'
import { loadInstruments } from '../../audio/engine'
import { commit, getProgress } from '../../progress/store'
import { applyPlay, dayKey, level as stats, playXp, starsFor, type BadgeId, type PlayResult } from '../../progress/progress'
import { Results } from '../results/Results'
import { Breaker } from './Breaker'
import { Blaster } from './Blaster'
import { Drops } from './Drops'

const ARCADES = { breaker: Breaker, blaster: Blaster, drops: Drops }

export function PlayScreen({ gameId, level }: { gameId: GameId; level: number }) {
  const game = GAMES[gameId]
  const [run, setRun] = useState(0)
  const [res, setRes] = useState<null | { r: PlayResult; badges: BadgeId[]; newBest: boolean }>(null)
  useEffect(() => { void loadInstruments(game.instruments) }, [game])

  function finish(r: PlayResult) {
    const id = levelId(gameId, level)
    const prevHi = stats(getProgress(), id).hiScore ?? 0
    const badges = commit((p) => applyPlay(p, id, r, dayKey()))
    setRes({ r, badges, newBest: prevHi > 0 && r.score > prevHi })
  }

  if (res)
    return <Results kind="play" gameId={gameId} level={level} correct={res.r.correct} total={res.r.total} xp={playXp(res.r)}
      score={res.r.score} maxCombo={res.r.maxCombo} stars={starsFor(res.r.correct / res.r.total)} newBest={res.newBest}
      badges={res.badges} again={() => { setRes(null); setRun((x) => x + 1) }} />

  const Arcade = ARCADES[game.arcade]
  return <Arcade key={run} game={game} level={level} onFinish={finish} />
}
