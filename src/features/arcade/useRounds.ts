import { useEffect, useReducer } from 'react'
import type { Game, Question } from '../../games/catalog'
import { itemKey } from '../../games/catalog'
import { mulberry32 } from '../../music/theory'
import { duration, play } from '../../audio/engine'
import { sfx } from '../../audio/sfx'
import { points, LATE_POINTS } from '../../games/score'
import type { PlayResult } from '../../progress/progress'
import type { Answer } from '../../progress/srs'
import { go } from '../../app/router'
import { useGame, useLater } from './hooks'
import type { Popup } from './shared'
import { en } from '../../i18n/en'

export type Phase = 'intro' | 'count' | 'ask' | 'hit' | 'miss' | 'over'

export type Rounds = ReturnType<typeof useRounds>

/**
 * A timed question round shared by the themed arcades (Climber, River, Potion, Hurdles, Fishing):
 * one question at a time, a clock per question, a wrong answer costs time (never a life), a timeout
 * reveals and replays the answer. Each arcade only draws its own scene from this state (ADR-024).
 */
export function useRounds(game: Game, level: number, onFinish: (r: PlayResult) => void, opts: { rounds?: number; seconds: number[] }) {
  const lv = game.levels[level]
  const total = opts.rounds ?? 12
  const [, render] = useReducer((x: number) => x + 1, 0)
  const later = useLater()
  const g = useGame(() => ({
    phase: 'intro' as Phase,
    rng: mulberry32(Date.now()),
    q: null as Question | null,
    ans: 0,
    /** time used for the current question, 0..1 */
    k: 0,
    t0: 0,
    T: opts.seconds[level] ?? opts.seconds[opts.seconds.length - 1],
    tried: false,
    wrong: -1,
    picked: -1,
    /** every correct answer, first try or not: how far the climber/runner has come */
    hits: 0,
    results: [] as boolean[],
    answers: [] as Answer[],
    score: 0,
    combo: 0,
    maxCombo: 0,
    banner: '',
    popups: [] as Popup[],
    pid: 0,
    n: 0,
  }))

  function popup(text: string, x = 50, y = 40, kind: Popup['kind'] = 'good') {
    const id = ++g.pid
    g.popups.push({ id, x, y, text, kind })
    later(900, () => { g.popups = g.popups.filter((p) => p.id !== id); render() })
  }

  function ask() {
    const q = lv.generate(g.rng)
    g.q = q
    g.ans = q.options.findIndex((o) => o.id === q.answer)
    g.T = (opts.seconds[level] ?? opts.seconds[opts.seconds.length - 1]) + duration(q.prompt) * 0.7
    g.t0 = performance.now()
    g.k = 0
    g.tried = false
    g.wrong = -1
    g.picked = -1
    g.n++
    g.phase = 'ask'
    play([...(q.context ?? []), ...q.prompt])
    if (q.context) g.t0 += duration(q.context) * 1000
    render()
  }

  const log = (ok: boolean) => {
    g.results.push(ok)
    g.answers.push({ key: itemKey(game.id, level, g.q!.answer), ok, lvl: level })
  }

  function answer(k: number) {
    if (g.phase !== 'ask') return
    const ok = k === g.ans
    const first = !g.tried
    if (first) { log(ok); g.tried = true }
    g.picked = k
    if (ok) {
      g.phase = 'hit'
      g.hits++
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
      later(g.q!.after ? 1300 : 900, next)
    } else {
      g.combo = 0
      g.wrong = k
      sfx.shield()
      popup('−1.5s', 50, 40, 'bad')
      g.t0 -= 1500
      later(400, () => { if (g.wrong === k) g.wrong = -1; render() })
    }
    render()
  }

  function timeout() {
    if (!g.tried) { log(false); g.combo = 0 }
    g.phase = 'miss'
    const o = g.q!.options[g.ans]
    g.banner = `${en.arcade.late} ${o.label}`
    sfx.whoosh()
    play(g.q!.after ?? g.q!.hear(g.q!.answer))
    later(2000, () => { g.banner = ''; next() })
    render()
  }

  function next() {
    if (g.results.length >= total) {
      g.phase = 'over'
      render()
      later(600, () => onFinish({ correct: g.results.filter(Boolean).length, total, score: g.score, maxCombo: g.maxCombo, answers: g.answers }))
    } else ask()
  }

  useEffect(() => {
    let raf = 0
    const loop = (t: number) => {
      if (g.phase === 'ask') {
        const k = Math.min(1, Math.max(0, (t - g.t0) / (g.T * 1000)))
        if (Math.abs(k - g.k) > 0.004) { g.k = k; render() }
        if (k >= 1) timeout()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  })

  const back = `/level/${game.id}/${level}`
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const K = g.q?.options.length ?? lv.options.length
      if (e.key === ' ') { e.preventDefault(); if (g.q) play(g.q.prompt) }
      else if (e.key === 'Escape') go(back)
      else if (/^[1-9]$/.test(e.key) && +e.key <= K) answer(+e.key - 1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  return { g, lv, total, back, answer, start: () => { g.phase = 'count'; render() }, ask, options: g.q?.options ?? lv.options }
}
