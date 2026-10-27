import { useState } from 'react'

const COLORS = ['var(--color-hi-yellow)', 'var(--color-marker-red)', 'var(--color-powder-sky)', 'var(--color-bubblegum-pink)', 'var(--color-jelly-green)', 'var(--color-electric-iris)']
const SHAPES = ['c-tri', 'c-circle', 'c-square', 'c-semi']

/** Paper-cut confetti burst; hidden under prefers-reduced-motion */
export function Confetti({ count = 48 }: { count?: number }) {
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      shape: SHAPES[i % SHAPES.length],
      color: COLORS[i % COLORS.length],
      x: Math.round((Math.random() - 0.5) * 900),
      y: Math.round(-200 - Math.random() * 350),
      r: Math.round(Math.random() * 720 - 360),
      d: (Math.random() * 0.4).toFixed(2),
      s: (0.6 + Math.random() * 0.8).toFixed(2),
    })))
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} className={`c ${p.shape}`}
          style={{ background: p.color, '--x': `${p.x}px`, '--y': `${p.y}px`, '--r': `${p.r}deg`, '--d': `${p.d}s`, '--s': p.s } as React.CSSProperties} />
      ))}
    </div>
  )
}
