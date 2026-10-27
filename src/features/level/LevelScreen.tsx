import { useEffect } from 'react'
import { GAMES, isUnlocked, levelId, nextStep, stepOpen, type GameId, type Step3 } from '../../games/catalog'
import { loadInstruments } from '../../audio/engine'
import { useProgress } from '../../progress/store'
import { level as stats } from '../../progress/progress'
import { fromParam, go, rememberFrom } from '../../app/router'
import { useKeys } from '../../app/keys'
import { ExitBar } from '../../ui/ExitBar'
import { Icon, type IconName } from '../../ui/Icon'
import { Pip, Bubble } from '../../ui/Pip'
import { Stars } from '../../ui/Stars'
import { World } from '../../ui/World'
import { en } from '../../i18n/en'

const STEPS: [Step3, IconName][] = [['learn', 'book'], ['practice', 'target'], ['play', 'gamepad']]

/** The gate between the path and a game: Learn → Practice → Play (ADR-013) */
export function LevelScreen({ gameId, level }: { gameId: GameId; level: number }) {
  const p = useProgress()
  const game = GAMES[gameId]
  const lv = game.levels[level]
  const id = levelId(gameId, level)
  const s = stats(p, id)
  const unlocked = isUnlocked(p, gameId, level)
  // warm up the samples this game needs while the learner reads the level card
  useEffect(() => { void loadInstruments(game.instruments) }, [game])
  useEffect(() => { rememberFrom(fromParam()) }, [])
  useKeys({ next: unlocked ? () => go(`/${next}/${gameId}/${level}`) : undefined, back: () => go(fromParam()), exit: () => go(fromParam()) })
  const next = nextStep(p, id)
  const done = (st: Step3) => (st === 'learn' ? s.learned : st === 'practice' ? s.practiced : (s.stars ?? 0) > 0)

  return (
    <div className={`level-screen world-bg-${game.world}`}>
      <header className={`level-hero hero-${game.world}`}>
        <World world={game.world} />
        <ExitBar back={fromParam()} onWorld />
        <div className="level-hero-inner">
          <span className="tag">{game.title} · {en.path.level} {level + 1}</span>
          <h1>{lv.title}</h1>
          <p>{lv.skill}</p>
          <Stars n={s.stars ?? 0} size={28} />
        </div>
      </header>

      <div className="level-body">
        <div className="pip-row">
          <Pip mood={unlocked ? 'talk' : 'think'} size={88} />
          <Bubble>{unlocked ? en.level.stepHints[next] : en.level.needs}</Bubble>
        </div>

        <ol className="steps">
          {STEPS.map(([st, icon], i) => {
            const open = unlocked && stepOpen(p, id, st)
            const isNext = unlocked && st === next
            return (
              <li key={st} className={`step ${done(st) ? 'is-done' : ''} ${isNext ? 'is-next' : ''} ${open ? '' : 'is-locked'}`}>
                <button className="step-card" disabled={!open} onClick={() => go(`/${st}/${gameId}/${level}`)}>
                  <span className="step-num">{done(st) ? <Icon name="check" size={22} /> : open ? i + 1 : <Icon name="lock" size={20} />}</span>
                  <span className="step-icon"><Icon name={icon} size={30} /></span>
                  <span className="step-text">
                    <strong>{en.level.steps[st]}</strong>
                    <span>{en.level.stepHints[st]}</span>
                  </span>
                  <span className="step-state">{done(st) ? en.level.done : isNext ? en.level.next : open ? en.level.again : en.level.locked}</span>
                </button>
              </li>
            )
          })}
        </ol>

        {unlocked && (
          <button className="btn-primary big" onClick={() => go(`/${next}/${gameId}/${level}`)}>
            {en.level.go[next]} <Icon name="arrow" size={20} />
          </button>
        )}
        <p className="key-hint">{en.keys.level}</p>
        {!!s.hiScore && <p className="hi-score"><Icon name="bolt" size={16} /> {en.level.hiScore}: {s.hiScore}</p>}
      </div>
    </div>
  )
}
