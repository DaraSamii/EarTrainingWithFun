import type { Game } from '../../games/catalog'
import type { PlayResult } from '../../progress/progress'
import { Pip } from '../../ui/Pip'
import { OptionFace } from '../../ui/OptionFace'
import { ArcadeFrame } from './ArcadeFrame'
import { useRounds } from './useRounds'

type Props = { game: Game; level: number; onFinish(r: PlayResult): void }

/** Seconds per question by level (prompt length is added on top) */
const CALM = [7, 6.5, 6, 6, 5.5, 5.5, 5, 5]

/** Pitch: climb a zigzag mountain trail, one ledge per right answer */
export function Climber({ game, level, onFinish }: Props) {
  const r = useRounds(game, level, onFinish, { seconds: CALM })
  const { g } = r
  const ledges = Array.from({ length: r.total + 1 }, (_, i) => ({ x: i % 2 ? 66 : 34, y: 90 - i * (80 / r.total) }))
  const at = ledges[Math.min(g.hits, r.total)]
  const nextL = ledges[Math.min(g.hits + 1, r.total)]
  const scene = (
    <div className="climb">
      <svg className="trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={ledges.map((l) => `${l.x},${l.y}`).join(' ')} />
      </svg>
      {ledges.map((l, i) => (
        <span key={i} className={`ledge ${i <= g.hits ? 'reached' : ''} ${i === r.total ? 'summit' : ''}`} style={{ left: `${l.x}%`, top: `${l.y}%` }} />
      ))}
      {g.phase === 'ask' && (
        <span className="ring" style={{ left: `${nextL.x}%`, top: `${nextL.y}%`, '--k': g.k } as React.CSSProperties} />
      )}
      <span className="flag" style={{ left: `${ledges[r.total].x}%`, top: `${ledges[r.total].y}%` }} aria-hidden="true" />
      <span className={`climber-pip ${g.phase === 'hit' ? 'hop' : g.wrong >= 0 ? 'slip' : ''}`} style={{ left: `${at.x}%`, top: `${at.y}%` }}>
        <Pip mood={g.phase === 'hit' ? 'happy' : g.phase === 'miss' ? 'oops' : 'think'} size={58} />
      </span>
    </div>
  )
  return <ArcadeFrame r={r} game={game} level={level} scene={scene} />
}

/** Melody: a paper boat drifts down a river toward a row of gates; steer into the right one */
export function River({ game, level, onFinish }: Props) {
  const r = useRounds(game, level, onFinish, { seconds: CALM })
  const { g } = r
  const K = r.options.length
  const gateX = (k: number) => ((k + 0.5) / K) * 100
  const target = g.phase === 'hit' || g.phase === 'miss' ? g.ans : g.wrong >= 0 ? g.wrong : -1
  const x = target >= 0 ? gateX(target) : 50
  const y = g.phase === 'hit' ? 96 : 8 + g.k * 64
  const scene = (
    <div className="river">
      <span className="water" />
      {r.options.map((o, k) => (
        <span key={k} className={`gate ${g.phase === 'hit' && k === g.ans ? 'open' : ''}`} style={{ left: `${gateX(k)}%` }}>
          <span className="gate-label"><OptionFace o={o} compact /></span>
        </span>
      ))}
      <span key={g.n} className={`boat ${g.phase === 'miss' ? 'sink' : ''} ${g.wrong >= 0 ? 'bump' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
    </div>
  )
  return <ArcadeFrame r={r} game={game} level={level} scene={scene} />
}

const POTION_COLORS = ['#ff4141', '#ffda00', '#16ab59', '#91d8ec', '#ffbac4', '#2727e6', '#ff9a3c']

/** Harmony: pour the matching potion into the cauldron before the fire dies */
export function Potion({ game, level, onFinish }: Props) {
  const r = useRounds(game, level, onFinish, { seconds: CALM })
  const { g } = r
  const brew = g.phase === 'hit' ? POTION_COLORS[g.ans % POTION_COLORS.length] : g.hits ? POTION_COLORS[(g.hits * 3) % POTION_COLORS.length] : '#7ddca4'
  const scene = (
    <div className="lab">
      <span className="shelf" />
      <div className={`cauldron ${g.phase === 'hit' ? 'brew' : ''} ${g.wrong >= 0 || g.phase === 'miss' ? 'smoke' : ''}`} style={{ '--brew': brew } as React.CSSProperties}>
        <span className="liquid" />
        {[0, 1, 2, 3].map((b) => <span key={b} className={`bubble b${b}`} />)}
        <span className="puff" key={`${g.n}-${g.phase}`} />
      </div>
      <span className="fire" style={{ '--k': g.phase === 'ask' ? g.k : 0 } as React.CSSProperties} aria-hidden="true">
        <i /><i /><i />
      </span>
      <span className="brewed">{g.hits} / {r.total}</span>
    </div>
  )
  return <ArcadeFrame r={r} game={game} level={level} scene={scene} zoneClass="bottles" />
}

/** Rhythm: hurdles race toward Pip; the right answer makes Pip jump */
export function Hurdles({ game, level, onFinish }: Props) {
  const r = useRounds(game, level, onFinish, { seconds: CALM })
  const { g } = r
  const hx = g.phase === 'hit' ? -10 : 94 - g.k * 72
  const scene = (
    <div className="track">
      <span className="ground" />
      <span className="lane-marks" />
      <span key={g.n} className={`hurdle ${g.phase === 'hit' ? 'cleared' : ''}`} style={{ left: `${hx}%` }} aria-hidden="true" />
      <span className={`runner ${g.phase === 'hit' ? 'jump' : g.phase === 'miss' ? 'trip' : 'run'}`}>
        <Pip mood={g.phase === 'hit' ? 'happy' : g.phase === 'miss' ? 'oops' : 'idle'} size={70} />
      </span>
      <span className="distance">{g.hits} / {r.total}</span>
    </div>
  )
  return <ArcadeFrame r={r} game={game} level={level} scene={scene} />
}

/** Sounds: fish swim by carrying the answers; hook the right one before the bobber sinks */
export function Fishing({ game, level, onFinish }: Props) {
  const r = useRounds(game, level, onFinish, { seconds: CALM })
  const { g } = r
  const K = r.options.length
  const scene = (
    <div className="pond">
      <span className="line" style={{ height: `${10 + g.k * 22}%` }} />
      <span className="bobber" style={{ top: `${10 + g.k * 22}%` }} />
      {r.options.map((o, k) => (
        <button key={`${g.n}-${k}`} aria-label={o.label}
          className={`fish f${k % 4} ${g.phase === 'hit' && k === g.ans ? 'caught' : ''} ${g.wrong === k ? 'splash' : ''} ${g.phase === 'miss' && k === g.ans ? 'reveal' : ''}`}
          style={{ top: `${36 + (k * 52) / Math.max(1, K)}%`, animationDuration: `${11 + (k % 3) * 2.5}s`, animationDelay: `${-k * 2.7}s` }}
          onPointerDown={(e) => { e.preventDefault(); r.answer(k) }} onClick={(e) => e.detail === 0 && r.answer(k)}>
          <span className="fish-body"><kbd aria-hidden="true">{k + 1}</kbd><OptionFace o={o} compact /></span>
          <span className="fish-tail" />
        </button>
      ))}
    </div>
  )
  return <ArcadeFrame r={r} game={game} level={level} scene={scene} zones={false} />
}
