import { useEffect, useState } from 'react'
import { GAMES, levelId, type GameId } from '../../games/catalog'
import { mulberry32, type Step } from '../../music/theory'
import { duration, loadInstruments, play } from '../../audio/engine'
import { sfx } from '../../audio/sfx'
import { commit } from '../../progress/store'
import { applyLearn, dayKey } from '../../progress/progress'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { Pip, Bubble, type Mood } from '../../ui/Pip'
import { Confetti } from '../../ui/Confetti'
import { World } from '../../ui/World'
import { Staff } from '../../ui/Staff'
import { OptionFace } from '../../ui/OptionFace'
import { ExitBar } from '../../ui/ExitBar'
import { en } from '../../i18n/en'

const TRIES = 3
const GAP: Step = { notes: [], dur: 0.6 }

type Phase = 'concept' | 'demo' | 'try' | 'ready'

/** Learn: explanation + demonstration + guided tries, before any practice or play (ADR-013) */
export function LearnScreen({ gameId, level }: { gameId: GameId; level: number }) {
  const game = GAMES[gameId]
  const lv = game.levels[level]
  const back = `/level/${gameId}/${level}`
  const [phase, setPhase] = useState<Phase>(lv.concept ? 'concept' : 'demo')
  const [heard, setHeard] = useState<string[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [rng] = useState(() => mulberry32(Date.now()))
  const [q, setQ] = useState(() => lv.generate(rng))
  const [tryN, setTryN] = useState(0)
  const [wrong, setWrong] = useState<string | null>(null)
  const [right, setRight] = useState(false)
  const [mood, setMood] = useState<Mood>('talk')
  // a level that only introduces a concept (e.g. new direction) still demonstrates every option
  const demoItems = lv.fresh.length ? lv.options.filter((o) => lv.fresh.includes(o.id)) : lv.options

  useEffect(() => { void loadInstruments(game.instruments) }, [game])

  function demo(id: string, withContext = false) {
    const steps = [...(withContext && lv.demoContext ? lv.demoContext : []), ...lv.demo(id)]
    play(steps)
    setActive(id)
    setHeard((h) => (h.includes(id) ? h : [...h, id]))
    setTimeout(() => setActive((a) => (a === id ? null : a)), duration(steps) * 1000)
  }

  function playAll() {
    // schedule each demo back to back so Pip "presents" them one by one
    const ctx = lv.demoContext ?? []
    let t = duration(ctx) * 1000
    play([...ctx, ...demoItems.flatMap((o) => [...lv.demo(o.id), GAP])])
    demoItems.forEach((o) => {
      setTimeout(() => setActive(o.id), t)
      t += duration([...lv.demo(o.id), GAP]) * 1000
    })
    setTimeout(() => setActive(null), t)
    setHeard(demoItems.map((o) => o.id))
  }

  const playQ = (x = q) => play([...(x.context ?? []), ...x.prompt])

  function startTries() {
    setPhase('try')
    setMood('think')
    playQ()
  }

  function answer(id: string) {
    if (right) return
    if (id === q.answer) {
      sfx.pop()
      setRight(true)
      setWrong(null)
      setMood('happy')
      play(q.after ?? q.hear(q.answer))
    } else {
      sfx.shield()
      setWrong(id)
      setMood('oops')
      play([...q.hear(id), GAP, ...q.hear(q.answer)])
    }
  }

  function nextTry() {
    if (tryN + 1 >= TRIES) {
      commit((p) => applyLearn(p, levelId(gameId, level), dayKey()))
      sfx.cheer()
      setMood('happy')
      setPhase('ready')
      return
    }
    const nq = lv.generate(rng, q.key)
    setQ(nq)
    setTryN(tryN + 1)
    setRight(false)
    setWrong(null)
    setMood('think')
    play(nq.prompt)
  }

  const say = phase === 'concept' ? lv.concept
    : phase === 'demo' ? en.learn.demoIntro
    : phase === 'ready' ? en.learn.ready
    : right ? en.learn.tryRight[tryN % en.learn.tryRight.length]
    : wrong ? en.learn.tryAgain : q.visual ? en.learn.tryRead : en.learn.tryIntro

  return (
    <div className={`learn world-bg-${game.world}`}>
      <div className="learn-sky"><World world={game.world} /></div>
      <header className="lesson-top">
        <ExitBar back={back} onWorld />
        <div className="learn-steps" aria-hidden="true">
          {(['concept', 'demo', 'try', 'ready'] as Phase[]).filter((x) => x !== 'concept' || lv.concept).map((x) => (
            <span key={x} className={x === phase ? 'on' : ''} />
          ))}
        </div>
        <span className="tag">{en.learn.title} · {game.title}</span>
      </header>

      <main className="learn-body">
        <div className="pip-stage">
          <Pip mood={mood} size={128} />
          <Bubble side="bottom"><p aria-live="polite">{say}</p></Bubble>
        </div>

        {phase === 'concept' && (
          <button className="btn-primary big" autoFocus onClick={() => setPhase('demo')}>{en.learn.next} <Icon name="arrow" size={20} /></button>
        )}

        {phase === 'demo' && (
          <>
            {lv.demoContext && (
              <button className="btn-soft" onClick={() => play(lv.demoContext!)}><Icon name="key" size={18} /> {en.learn.listenKey}</button>
            )}
            <div className="demo-cards">
              {demoItems.map((o, i) => (
                <button key={o.id} style={{ animationDelay: `${i * 80}ms` }}
                  className={`demo-card ${active === o.id ? 'playing' : ''} ${heard.includes(o.id) ? 'heard' : ''}`}
                  onClick={() => demo(o.id, heard.length === 0)}>
                  <span className="demo-play"><Icon name={active === o.id ? 'volume' : 'play'} size={22} /></span>
                  {lv.demoVisual && <Staff v={lv.demoVisual(o.id)} width={170} />}
                  <span className="demo-label"><OptionFace o={o} /></span>
                  <span className="demo-hint">{lv.hint(o.id)}</span>
                </button>
              ))}
            </div>
            <div className="actions">
              <button className="btn-ghost" onClick={playAll}><Icon name="play" size={18} /> {en.learn.playAll}</button>
              <button className="btn-primary" disabled={heard.length < demoItems.length} onClick={startTries}>
                {en.learn.next} <Icon name="arrow" size={20} />
              </button>
            </div>
          </>
        )}

        {phase === 'try' && (
          <>
            <p className="try-count">{en.learn.try} {tryN + 1} {en.learn.of} {TRIES}</p>
            {q.visual ? <div className="visual-card"><Staff v={q.visual} width={240} /></div>
              : <button className="replay small" aria-label={en.lesson.replay} onClick={() => playQ()}><Icon name="play" size={34} /></button>}
            <div className="answers" data-count={q.options.length}>
              {q.options.map((o, k) => (
                <button key={o.id} onClick={() => answer(o.id)} aria-disabled={right}
                  className={`answer ${right && o.id === q.answer ? 'is-correct' : o.id === wrong ? 'is-wrong' : right ? 'is-dim' : ''}`}>
                  <kbd aria-hidden="true">{k + 1}</kbd>
                  <OptionFace o={o} />
                </button>
              ))}
            </div>
            {right && <button className="btn-primary big" autoFocus onClick={nextTry}>{en.learn.next} <Icon name="arrow" size={20} /></button>}
          </>
        )}

        {phase === 'ready' && (
          <>
            <Confetti />
            <button className="btn-primary big" autoFocus onClick={() => go(`/practice/${gameId}/${level}`)}>
              {en.learn.toPractice} <Icon name="arrow" size={20} />
            </button>
          </>
        )}
      </main>
    </div>
  )
}
