import type { Option } from '../games/types'

/** A melodic contour as a little line drawing */
export function Contour({ shape, w = 72, h = 34 }: { shape: number[]; w?: number; h?: number }) {
  const lo = Math.min(...shape)
  const span = Math.max(1, Math.max(...shape) - lo)
  const pts = shape.map((v, i) => [6 + (i * (w - 12)) / (shape.length - 1), h - 6 - ((v - lo) * (h - 12)) / span])
  return (
    <svg className="contour" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={pts.map((p) => p.join(',')).join(' ')} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" />)}
    </svg>
  )
}

/** A one-bar rhythm as boxes grouped by beat: filled = hit */
export function BeatGrid({ grid }: { grid: number[] }) {
  const per = grid.length === 12 ? 3 : grid.length / 4
  return (
    <span className="beat-grid" aria-hidden="true">
      {Array.from({ length: grid.length / per }, (_, b) => (
        <span key={b} className="beat">
          {grid.slice(b * per, b * per + per).map((v, k) => <i key={k} className={v ? 'hit' : ''} />)}
        </span>
      ))}
    </span>
  )
}

/** What an answer button shows: a contour drawing, or a label with an optional sub-label */
export function OptionFace({ o, compact = false }: { o: Option; compact?: boolean }) {
  return (
    <>
      {o.shape && <Contour shape={o.shape} w={compact ? 54 : 72} h={compact ? 26 : 34} />}
      {o.grid && <BeatGrid grid={o.grid} />}
      <span className="answer-label">{o.label}</span>
      {o.sub && !compact && <span className="answer-sub">{o.sub}</span>}
    </>
  )
}
