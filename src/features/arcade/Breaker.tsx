import { useEffect, useReducer, useRef } from 'react'
import type { Game, Question } from '../../games/catalog'
import { mulberry32 } from '../../music/theory'
import { duration, play } from '../../audio/engine'
import { sfx } from '../../audio/sfx'
import { points, LATE_POINTS } from '../../games/score'
import type { PlayResult } from '../../progress/progress'
import type { Answer } from '../../progress/srs'
import { itemKey } from '../../games/catalog'
import { go } from '../../app/router'
import { World } from '../../ui/World'
import { OptionFace } from '../../ui/OptionFace'
import { Countdown, Hud, Popups, StartOverlay, type Popup } from './shared'
import { useGame, useLater } from './hooks'
import { en } from '../../i18n/en'

const BRICKS = 10
/** Seconds for the ball to fall, per level */
const DESCENT = [3.4, 3.1, 2.9, 2.7, 2.7]
/** Fraction of the fall after which the ball is invisible: scaffold fading (ADR-016) */
const VISIBLE = [1.5, 0.75, 0.55, 0.4, 0.3]
const PADDLE_Y = 82
const BRICK_POS = Array.from({ length: BRICKS }, (_, i) => ({ x: 10 + (i % 5) * 20, y: 10 + Math.floor(i / 5) * 11 }))
const TONES = ['t-yellow', 't-pink', 't-sky', 't-green', 't-red']

type Tween = { fx: number; fy: number; tx: number; ty: number; t0: number; dur: number; ease(k: number): number; done(): void }
const easeOut = (k: number) => 1 - (1 - k) ** 2
const linear = (k: number) => k

/** Breakout for any pick-one game, after Theta's Paddle Tones (ADR-016) */
export function Breaker({ game, level, onFinish }: { game: Game; level: number; onFinish(r: PlayResult): void }) {
  const lv = game.levels[level]
  const back = `/level/${game.id}/${level}`
  const K = lv.options.length
  const zoneX = (k: number) => ((k + 0.5) / K) * 100
  const [, render] = useReducer((x: number) => x + 1, 0)
  const later = useLater()
  const ballRef = useRef<HTMLSpanElement>(null)
  const g = useGame(() => ({
    phase: 'intro' as 'intro' | 'count' | 'up' | 'wait' | 'down' | 'miss' | 'over',
    rng: mulberry32(Date.now()),
    broken: [] as number[],
    paddle: Math.floor(K / 2),
    q: null as Question | null,
    ans: 0,
    key: undefined as number | undefined,
    tapped: false,
    locked: false,
    results: [] as boolean[],
    answers: [] as Answer[],
    t0: 0,
    /** fall time for the current question: longer prompts get more time */
    D: DESCENT[level],
    score: 0,
    combo: 0,
    maxCombo: 0,
    ball: { x: zoneX(Math.floor(K / 2)), y: PADDLE_Y - 4, o: 1 },
    tween: null as Tween | null,
    banner: '',
    reveal: -1,
    popups: [] as Popup[],
    pid: 0,
  }))

  const tweenTo = (tx: number, ty: number, dur: number, ease: Tween['ease'], done: () => void) => {
    g.tween = { fx: g.ball.x, fy: g.ball.y, tx, ty, t0: performance.now(), dur, ease, done }
  }

  useEffect(() => {
    let raf = 0
    const loop = (t: number) => {
      const tw = g.tween
      if (tw) {
        const k = Math.min(1, (t - tw.t0) / (tw.dur * 1000))
        g.ball.x = tw.fx + (tw.tx - tw.fx) * tw.ease(k)
        g.ball.y = tw.fy + (tw.ty - tw.fy) * tw.ease(k)
        if (k >= 1) { g.tween = null; tw.done() }
      }
      if (g.phase === 'down' && !g.locked) {
        const frac = (t - g.t0) / (g.D * 1000)
        const vis = VISIBLE[level]
        g.ball.o = frac < vis - 0.2 ? 1 : Math.max(0, (vis - frac) / 0.2)
      } else g.ball.o = 1
      const el = ballRef.current
      if (el) {
        el.style.left = `${g.ball.x}%`
        el.style.top = `${g.ball.y}%`
        el.style.opacity = String(g.ball.o)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [g, level])

  function popup(x: number, y: number, text: string, kind: Popup['kind'] = 'good') {
    const id = ++g.pid
    g.popups.push({ id, x, y, text, kind })
    later(900, () => { g.popups = g.popups.filter((p) => p.id !== id); render() })
  }

  function launch() {
    g.phase = 'up'
    const left = BRICK_POS.map((_, i) => i).filter((i) => !g.broken.includes(i))
    const b = left[Math.floor(g.rng() * left.length)]
    tweenTo(BRICK_POS[b].x, BRICK_POS[b].y + 6, 0.5, easeOut, () => hit(b))
    render()
  }

  function hit(b: number) {
    g.broken.push(b)
    sfx.hit()
    const keepKey = lv.keyEvery ? (g.broken.length - 1) % lv.keyEvery !== 0 : true
    const q = lv.generate(g.rng, keepKey ? g.key : undefined)
    const newKey = !!q.context && q.key !== g.key
    g.q = q
    g.key = q.key
    g.ans = q.options.findIndex((o) => o.id === q.answer)
    if (newKey) {
      g.phase = 'wait'
      g.banner = g.broken.length === 1 ? en.lesson.key : en.arcade.newKey
      play([...(q.context ?? []), ...q.prompt])
      later(duration(q.context ?? []) * 1000, () => { g.banner = ''; descend() })
    } else {
      play(q.prompt)
      descend()
    }
    render()
  }

  function descend() {
    g.phase = 'down'
    g.t0 = performance.now()
    g.tapped = false
    g.locked = false
    g.D = DESCENT[level] + duration(g.q!.prompt) * 0.7
    tweenTo(zoneX(g.ans), PADDLE_Y - 3, g.D, linear, land)
    render()
  }

  function tap(k: number) {
    if (g.phase !== 'down' || g.locked) return
    g.paddle = k
    const ok = k === g.ans
    const first = !g.tapped
    if (first) { g.results.push(ok); g.answers.push({ key: itemKey(game.id, level, g.q!.answer), ok, lvl: level }); g.tapped = true }
    if (ok) {
      g.locked = true
      if (first) {
        g.combo++
        g.maxCombo = Math.max(g.maxCombo, g.combo)
        const left = 1 - (performance.now() - g.t0) / (g.D * 1000)
        const pts = points(left, g.combo)
        g.score += pts
        popup(zoneX(k), PADDLE_Y - 14, `+${pts} ${left > 0.5 ? en.arcade.fast : en.arcade.good}`)
      } else {
        g.score += LATE_POINTS
        popup(zoneX(k), PADDLE_Y - 14, `+${LATE_POINTS}`)
      }
      // the ball zips straight to the paddle: fast players play fast
      tweenTo(zoneX(g.ans), PADDLE_Y - 3, 0.22, easeOut, land)
    } else {
      g.combo = 0
      sfx.shield()
    }
    render()
  }

  function land() {
    if (!g.tapped) { g.results.push(false); g.answers.push({ key: itemKey(game.id, level, g.q!.answer), ok: false, lvl: level }); g.combo = 0 }
    if (g.locked) {
      sfx.pop()
      next()
      return
    }
    // miss: show and replay the right answer, then carry on (no lives, ADR-014)
    g.phase = 'miss'
    g.combo = 0
    g.reveal = g.ans
    const o = g.q!.options[g.ans]
    g.banner = `${en.arcade.miss} ${o.label}${o.sub && !o.shape ? ` (${o.sub})` : ''}`
    sfx.whoosh()
    play([...g.q!.hear(g.q!.answer), ...(g.q!.after ?? [])])
    tweenTo(g.ball.x, 108, 0.35, linear, () => {})
    later(2200, () => {
      g.reveal = -1
      g.banner = ''
      g.ball = { x: zoneX(g.paddle), y: PADDLE_Y - 4, o: 1 }
      next()
    })
    render()
  }

  function next() {
    if (g.results.length >= BRICKS) {
      g.phase = 'over'
      render()
      later(700, () => onFinish({ correct: g.results.filter(Boolean).length, total: BRICKS, score: g.score, maxCombo: g.maxCombo, answers: g.answers }))
    } else launch()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === ' ') { e.preventDefault(); if (g.q) play(g.q.prompt) }
      else if (e.key === 'Escape') go(back)
      else if (/^[1-9]$/.test(e.key) && +e.key <= K) tap(+e.key - 1)
      else if (e.key === 'ArrowLeft') tap(Math.max(0, g.paddle - 1))
      else if (e.key === 'ArrowRight') tap(Math.min(K - 1, g.paddle + 1))
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  return (
    <div className={`arcade world-bg-${game.world}`}>
      <World world={game.world} />
      <Hud total={BRICKS} results={g.results} score={g.score} combo={g.combo}
        back={back} onReplay={() => g.q && play(g.q.prompt)} />

      <div className="stage breaker">
        {BRICK_POS.map((b, i) => (
          <span key={i} className={`brick ${TONES[i % TONES.length]} ${g.broken.includes(i) ? 'broken' : ''}`}
            style={{ left: `${b.x}%`, top: `${b.y}%` }} />
        ))}
        <span ref={ballRef} className="ball" />
        <span className="paddle" style={{ left: `${zoneX(g.paddle)}%`, top: `${PADDLE_Y}%`, width: `${Math.min(26, 80 / K)}%` }} />
        <Popups items={g.popups} />
        {g.banner && <div className="banner" role="status">{g.banner}</div>}
        {g.phase === 'down' && !g.tapped && g.results.length === 0 && <p className="stage-hint">{en.arcade.tapZone}</p>}
      </div>

      <div className="zones" data-count={K}>
        {(g.q?.options ?? lv.options).map((o, k) => (
          <button key={o.id} className={`zone ${g.paddle === k ? 'is-paddle' : ''} ${g.reveal === k ? 'reveal' : ''}`}
            onPointerDown={(e) => { e.preventDefault(); tap(k) }} onClick={(e) => e.detail === 0 && tap(k)}>
            <kbd aria-hidden="true">{k + 1}</kbd>
            <OptionFace o={o} compact={K > 4} />
          </button>
        ))}
      </div>

      {g.phase === 'intro' && (
        <StartOverlay title={`${game.title} · ${en.path.level} ${level + 1}`} text={en.arcade.tapZone}
          help={en.arcadeHelp.breaker} onStart={() => { g.phase = 'count'; render() }} />
      )}
      {g.phase === 'count' && <Countdown onDone={launch} />}
    </div>
  )
}
