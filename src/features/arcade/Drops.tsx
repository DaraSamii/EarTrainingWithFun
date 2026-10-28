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

const ITEMS = 12
/** Seconds for an item to fall, per level */
const FALL = [6.5, 6, 5.5, 5, 4.5]
const TOP = 6
const FLOOR = 74
/** A wrong answer makes the item lurch down: lost time, never a life (ADR-014, after Theta's Tone Drops) */
const LURCH = 0.18

/** Falling items for any pick-one game, after Theta's Tone Drops (ADR-016) */
export function Drops({ game, level, onFinish }: { game: Game; level: number; onFinish(r: PlayResult): void }) {
  const lv = game.levels[level]
  const K = lv.options.length
  const back = `/level/${game.id}/${level}`
  const [, render] = useReducer((x: number) => x + 1, 0)
  const later = useLater()
  const itemRef = useRef<HTMLDivElement>(null)
  const g = useGame(() => ({
    phase: 'intro' as 'intro' | 'count' | 'fall' | 'between' | 'over',
    rng: mulberry32(Date.now()),
    q: null as Question | null,
    ans: 0,
    x: 50,
    /** fall progress 0..1 */
    k: 0,
    t0: 0,
    T: FALL[level],
    tried: false,
    wrong: -1,
    state: '' as '' | 'pop' | 'splat' | 'lurch',
    results: [] as boolean[],
    answers: [] as Answer[],
    score: 0,
    combo: 0,
    maxCombo: 0,
    banner: '',
    reveal: -1,
    popups: [] as Popup[],
    pid: 0,
    n: 0,
  }))

  function popup(text: string, kind: Popup['kind'] = 'good') {
    const id = ++g.pid
    g.popups.push({ id, x: g.x, y: TOP + (FLOOR - TOP) * g.k - 8, text, kind })
    later(900, () => { g.popups = g.popups.filter((p) => p.id !== id); render() })
  }

  function spawn() {
    const q = lv.generate(g.rng)
    g.q = q
    g.ans = q.options.findIndex((o) => o.id === q.answer)
    g.x = 18 + g.rng() * 64
    g.k = 0
    // reading items need no listening time; sounds get their prompt length on top
    g.T = FALL[level] + duration(q.prompt) * 0.6
    g.t0 = performance.now()
    g.tried = false
    g.wrong = -1
    g.state = ''
    g.n++
    g.phase = 'fall'
    play(q.prompt)
    render()
  }

  function answer(k: number) {
    if (g.phase !== 'fall') return
    const ok = k === g.ans
    const first = !g.tried
    if (first) { g.results.push(ok); g.answers.push({ key: itemKey(game.id, level, g.q!.answer), ok, lvl: level }); g.tried = true }
    if (ok) {
      g.phase = 'between'
      g.state = 'pop'
      sfx.pop()
      let pts = LATE_POINTS
      if (first) {
        g.combo++
        g.maxCombo = Math.max(g.maxCombo, g.combo)
        pts = points(1 - g.k, g.combo)
        popup(`+${pts} ${g.k < 0.5 ? en.arcade.fast : en.arcade.good}`)
      } else popup(`+${pts}`)
      g.score += pts
      if (g.q!.after) play(g.q!.after)
      later(g.q!.after ? 1200 : 700, next)
    } else {
      g.combo = 0
      g.wrong = k
      g.state = 'lurch'
      sfx.shield()
      // jump the clock forward: the item drops a chunk
      g.t0 -= LURCH * g.T * 1000
      later(300, () => { if (g.state === 'lurch') g.state = ''; render() })
    }
    render()
  }

  function land() {
    if (!g.tried) { g.results.push(false); g.answers.push({ key: itemKey(game.id, level, g.q!.answer), ok: false, lvl: level }); g.combo = 0 }
    g.phase = 'between'
    g.state = 'splat'
    g.reveal = g.ans
    g.banner = `${en.arcade.miss} ${g.q!.options[g.ans].label}`
    sfx.whoosh()
    play(g.q!.after ?? g.q!.hear(g.q!.answer))
    later(2000, () => { g.reveal = -1; g.banner = ''; next() })
    render()
  }

  function next() {
    if (g.results.length >= ITEMS) {
      g.phase = 'over'
      render()
      later(600, () => onFinish({ correct: g.results.filter(Boolean).length, total: ITEMS, score: g.score, maxCombo: g.maxCombo, answers: g.answers }))
    } else spawn()
  }

  useEffect(() => {
    let raf = 0
    const loop = (t: number) => {
      if (g.phase === 'fall') {
        g.k = Math.min(1, (t - g.t0) / (g.T * 1000))
        if (g.k >= 1) land()
      }
      const el = itemRef.current
      if (el) el.style.top = `${TOP + (FLOOR - TOP) * g.k}%`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === ' ') { e.preventDefault(); if (g.q) play(g.q.prompt) }
      else if (e.key === 'Escape') go(back)
      else if (/^[1-9]$/.test(e.key) && +e.key <= K) answer(+e.key - 1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  return (
    <div className={`arcade world-bg-${game.world}`}>
      <World world={game.world} />
      <Hud total={ITEMS} results={g.results} score={g.score} combo={g.combo}
        back={back} onReplay={g.q?.prompt.length ? () => play(g.q!.prompt) : undefined} />

      <div className="stage drops">
        {g.q && g.phase !== 'intro' && g.phase !== 'count' && (
          <div key={g.n} ref={itemRef} className={`drop drop-${game.world} ${g.q.visual ? 'drop-card' : ''} ${g.state}`}
            style={{ left: `${g.x}%`, top: `${TOP}%` }}>
            {g.q.visual ? <Staff v={g.q.visual} width={150} /> : <span className="drop-face">?</span>}
          </div>
        )}
        <span className="ground" />
        <Popups items={g.popups} />
        <Presence show={!!g.banner} className="banner-wrap"><div className="banner" role="status">{g.banner}</div></Presence>
      </div>

      <div className="zones" data-count={K}>
        {(g.q?.options ?? lv.options).map((o, k) => (
          <button key={o.id} className={`zone ${g.reveal === k ? 'reveal' : ''} ${g.wrong === k ? 'is-wrong' : ''}`}
            onPointerDown={(e) => { e.preventDefault(); answer(k) }} onClick={(e) => e.detail === 0 && answer(k)}>
            <kbd aria-hidden="true">{k + 1}</kbd>
            <OptionFace o={o} compact={K > 4} />
          </button>
        ))}
      </div>

      <Presence show={g.phase === 'intro'} className="layer-top">
        <StartOverlay title={`${game.title} · ${en.path.level} ${level + 1}`} text={en.arcade.drops}
          help={en.arcadeHelp.drops} onStart={() => { g.phase = 'count'; render() }} />
      </Presence>
      {g.phase === 'count' && <Countdown onDone={spawn} />}
    </div>
  )
}
