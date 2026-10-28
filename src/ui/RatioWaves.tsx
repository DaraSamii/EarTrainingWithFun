import { en } from '../i18n/en'

/** Frequency ratios as waves: e.g. 3:2 draws 3 and 2 cycles over the same time; they realign at the end */
export function RatioWaves({ ratio }: { ratio: number[] }) {
  const W = 300
  const H = 34
  const path = (cycles: number) => {
    const pts: string[] = []
    for (let x = 0; x <= W; x += 2) pts.push(`${x},${(H / 2 - Math.sin((x / W) * cycles * 2 * Math.PI) * (H / 2 - 4)).toFixed(1)}`)
    return `M${pts.join(' L')}`
  }
  return (
    <figure className="ratio-waves" aria-label={`${en.learn.ratio} ${ratio.join(':')}`}>
      <svg viewBox={`0 0 ${W} ${H * ratio.length}`} aria-hidden="true">
        {ratio.map((r, k) => (
          <g key={k} transform={`translate(0 ${k * H})`}>
            <path className={`wave w${k}`} d={path(r)} />
            <text x={W - 4} y={12} textAnchor="end">{r}</text>
          </g>
        ))}
        <line x1="1" x2="1" y1="0" y2={H * ratio.length} className="align" />
        <line x1={W - 1} x2={W - 1} y1="0" y2={H * ratio.length} className="align" />
      </svg>
      <figcaption>{en.learn.ratio} <strong>{ratio.join(' : ')}</strong></figcaption>
    </figure>
  )
}
