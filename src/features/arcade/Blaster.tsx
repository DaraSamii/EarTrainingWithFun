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
import { Staff } from '../../ui/Staff'
import { Countdown, Hud, Popups, StartOverlay, type Popup } from './shared'
import { useGame, useLater } from './hooks'
import { Presence } from '../../ui/Presence'
import { en } from '../../i18n/en'

const WAVES = 12
/** Seconds per wave, per level */
const TIME = [7, 6.5, 6, 5.5, 5.5]
/** A wrong shot costs time, never a life (ADR-014) */
const WRONG_PENALTY = 1.5
const CANNON = { x: 50, y: 90 }
const SHIP_TONES = ['t-pink', 't-yellow', 't-sky', 't-green', 't-red']

type ShipState = 'idle' | 'boom' | 'shield' | 'escape'

/** Shooter for any pick-one game, after Theta's Number Blaster (ADR-016) */
export function Blaster({ game, level, onFinish }: { game: Game; level: number; onFinish(r: PlayResult): void }) {
  const lv = game.levels[level]
  const back = `/level/${game.id}/${level}`
  const K = lv.options.length
  const T = TIME[level]
  const ship = (k: number) => ({ x: ((k + 0.5) / K) * 100, y: 24 + (k % 2) * 12 })
  const [, render] = useReducer((x: number) => x + 1, 0)
  const later = useLater()
  const stageRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const g = useGame(() => ({
    phase: 'intro' as 'intro' | 'count' | 'wave' | 'between' | 'over',
    rng: mulberry32(Date.now()),
    q: null as Question | null,
    ans: 0,
    start: 0,
    deadline: 0,
    shot: false,
    results: [] as boolean[],
    answers: [] as Answer[],
    score: 0,
    combo: 0,
    maxCombo: 0,
    ships: Array<ShipState>(K).fill('idle'),
    spawn: Array<number>(K).fill(0),
    angle: 0,
    laser: null as null | { id: number; len: number; angle: number },
    banner: '',
    popups: [] as Popup[],
    pid: 0,
  }))

  function popup(x: number, y: number, text: string, kind: Popup['kind'] = 'good') {
    const id = ++g.pid
    g.popups.push({ id, x, y, text, kind })
    later(900, () => { g.popups = g.popups.filter((p) => p.id !== id); render() })
  }

  function wave() {
    const q = lv.generate(g.rng)
    g.q = q
    g.ans = q.options.findIndex((o) => o.id === q.answer)
    g.shot = false
    g.ships = g.ships.map(() => 'idle')
    play(q.prompt)
    // the clock starts once most of the prompt has sounded
    g.start = performance.now() + duration(q.prompt) * 600
    g.deadline = g.start + T * 1000
    g.phase = 'wave'
    render()
  }

  function shoot(k: number) {
    if (g.phase !== 'wave' || g.ships[k] !== 'idle') return
    // aim: stage-space angle and distance from the cannon to the ship
    const r = stageRef.current?.getBoundingClientRect()
    const s = ship(k)
    const dx = ((s.x - CANNON.x) / 100) * (r?.width ?? 1)
    const dy = ((s.y - CANNON.y) / 100) * (r?.height ?? 1)
    g.angle = (Math.atan2(dx, -dy) * 180) / Math.PI
    g.laser = { id: ++g.pid, len: Math.hypot(dx, dy), angle: g.angle }
    sfx.zap()
    const ok = k === g.ans
    const first = !g.shot
    if (first) { g.results.push(ok); g.answers.push({ key: itemKey(game.id, level, g.q!.answer), ok, lvl: level }); g.shot = true }
    if (ok) {
      g.phase = 'between'
      g.ships[k] = 'boom'
      sfx.boom()
      let pts = LATE_POINTS
      if (first) {
        g.combo++
        g.maxCombo = Math.max(g.maxCombo, g.combo)
        const left = (g.deadline - performance.now()) / (T * 1000)
        pts = points(left, g.combo)
        popup(s.x, s.y - 8, `+${pts} ${left > 0.5 ? en.arcade.fast : en.arcade.good}`)
      } else popup(s.x, s.y - 8, `+${pts}`)
      g.score += pts
      if (g.q!.after) play(g.q!.after)
      later(1000, () => respawn(k))
    } else {
      g.combo = 0
      g.ships[k] = 'shield'
      g.deadline -= WRONG_PENALTY * 1000
      sfx.shield()
      popup(s.x, s.y - 8, `−${WRONG_PENALTY}s`, 'bad')
      later(450, () => { if (g.ships[k] === 'shield') g.ships[k] = 'idle'; render() })
    }
    later(160, () => { g.laser = null; render() })
    render()
  }

  function timeout() {
    if (!g.shot) { g.results.push(false); g.answers.push({ key: itemKey(game.id, level, g.q!.answer), ok: false, lvl: level }); g.combo = 0 }
    g.phase = 'between'
    g.ships[g.ans] = 'escape'
    g.banner = `${en.arcade.late} ${g.q!.options[g.ans].label}`
    sfx.whoosh()
    play(g.q!.after ?? g.q!.hear(g.q!.answer))
    const k = g.ans
    later(2000, () => { g.banner = ''; respawn(k) })
    render()
  }

  useEffect(() => {
    let raf = 0
    const loop = (t: number) => {
      if (g.phase === 'wave') {
        const left = Math.max(0, Math.min(1, (g.deadline - t) / (T * 1000)))
        if (barRef.current) barRef.current.style.transform = `scaleX(${left})`
        if (t >= g.deadline) timeout()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  })

  function respawn(k: number) {
    g.spawn[k]++
    g.ships[k] = 'idle'
    if (g.results.length >= WAVES) {
      g.phase = 'over'
      render()
      later(600, () => onFinish({ correct: g.results.filter(Boolean).length, total: WAVES, score: g.score, maxCombo: g.maxCombo, answers: g.answers }))
    } else later(350, wave)
    render()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === ' ') { e.preventDefault(); if (g.q) play(g.q.prompt) }
      else if (e.key === 'Escape') go(back)
      else if (/^[1-9]$/.test(e.key) && +e.key <= K) shoot(+e.key - 1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  return (
    <div className={`arcade world-bg-${game.world}`}>
      <World world={game.world} />
      <Hud total={WAVES} results={g.results} score={g.score} combo={g.combo}
        back={back} onReplay={g.q?.prompt.length ? () => play(g.q!.prompt) : undefined} />

      <div className="stage blaster" ref={stageRef} style={{ '--k': K } as React.CSSProperties}>
        {(g.q?.options ?? lv.options).map((o, k) => {
          const s = ship(k)
          return (
            <button key={`${k}-${g.spawn[k]}`} className={`ship ${SHIP_TONES[k % SHIP_TONES.length]} ship-${g.ships[k]}`}
              style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${k * -0.7}s` }}
              onPointerDown={(e) => { e.preventDefault(); shoot(k) }} onClick={(e) => e.detail === 0 && shoot(k)}
              aria-label={o.label}>
              <span className="ship-dome" />
              <span className="ship-hull">
                <kbd aria-hidden="true">{k + 1}</kbd>
                <span className="ship-label"><OptionFace o={o} compact /></span>
              </span>
            </button>
          )
        })}
        <span className="cannon" style={{ left: `${CANNON.x}%`, top: `${CANNON.y}%`, rotate: `${g.angle}deg` }} />
        {g.laser && (
          <span key={g.laser.id} className="laser"
            style={{ left: `${CANNON.x}%`, top: `${CANNON.y}%`, height: g.laser.len, rotate: `${g.laser.angle}deg` }} />
        )}
        {g.phase === 'wave' && !g.q?.visual && <span className="signal" style={{ left: '50%', top: '62%' }} />}
        {g.q?.visual && g.phase !== 'intro' && <div className="stage-visual" key={g.results.length}><Staff v={g.q.visual} width={200} /></div>}
        <Popups items={g.popups} />
        <Presence show={!!g.banner} className="banner-wrap"><div className="banner" role="status">{g.banner}</div></Presence>
      </div>

      <div className="timer"><span ref={barRef} /></div>

      <Presence show={g.phase === 'intro'} className="layer-top">
        <StartOverlay title={`${game.title} · ${en.path.level} ${level + 1}`} text={en.arcade.shoot}
          help={en.arcadeHelp.blaster} onStart={() => { g.phase = 'count'; render() }} />
      </Presence>
      {g.phase === 'count' && <Countdown onDone={wave} />}
    </div>
  )
}
