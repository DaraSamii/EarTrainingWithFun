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

/** What an answer button shows: a contour drawing, or a label with an optional sub-label */
export function OptionFace({ o, compact = false }: { o: Option; compact?: boolean }) {
  return (
    <>
      {o.shape && <Contour shape={o.shape} w={compact ? 54 : 72} h={compact ? 26 : 34} />}
      <span className="answer-label">{o.label}</span>
      {o.sub && !compact && <span className="answer-sub">{o.sub}</span>}
    </>
  )
}
