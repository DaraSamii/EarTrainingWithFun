import { CLEF_BOTTOM, SIG_FLATS, SIG_SHARPS, diatonic } from '../music/theory'
import type { Visual } from '../games/types'

const GAP = 10 // distance between staff lines
const TOP = 34 // y of the top line

/** A five-line staff with clef, optional key signature and whole notes (hand-drawn SVG, no notation library) */
export function Staff({ v, width = 200 }: { v: Visual; width?: number }) {
  const bottom = CLEF_BOTTOM[v.clef]
  const y = (midi: number) => TOP + 4 * GAP - (diatonic(midi) - bottom) * (GAP / 2)
  const sig = v.keySig ?? 0
  const sigPos = (sig > 0 ? SIG_SHARPS : SIG_FLATS).slice(0, Math.abs(sig))
  // bass clef accidentals sit one line (2 diatonic steps) lower than treble
  const sigY = (m: number) => y(m) + (v.clef === 'bass' ? GAP : 0)
  const noteX = 70 + Math.abs(sig) * 12 + 24
  const h = TOP * 2 + 4 * GAP
  return (
    <svg className="staff" viewBox={`0 0 ${Math.max(width, noteX + 40)} ${h}`} role="img"
      aria-label={v.notes.length ? 'note on a staff' : `key signature with ${Math.abs(sig)} ${sig >= 0 ? 'sharps' : 'flats'}`}>
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="4" x2="99%" y1={TOP + i * GAP} y2={TOP + i * GAP} />)}
      <text className="clef" x={v.clef === 'treble' ? 8 : 10} y={v.clef === 'treble' ? TOP + 3.1 * GAP : TOP + 2.6 * GAP}>
        {v.clef === 'treble' ? '𝄞' : '𝄢'}
      </text>
      {sigPos.map((m, i) => (
        <text key={i} className="acc" x={52 + i * 12} y={sigY(m) + (sig > 0 ? 6 : 3)}>{sig > 0 ? '♯' : '♭'}</text>
      ))}
      {v.notes.map((n, i) => {
        const ny = y(n)
        // stacked notes share a column; a 2nd would overlap, so its upper note steps aside
        const x = v.stack ? noteX + (i && diatonic(n) - diatonic(v.notes[i - 1]) === 1 ? 15 : 0) : noteX + i * 30
        const d = diatonic(n) - bottom
        // ledger lines for notes below or above the staff
        const ledgers = d < -1 ? Array.from({ length: Math.floor(-d / 2) }, (_, k) => TOP + 4 * GAP + (k + 1) * GAP)
          : d > 9 ? Array.from({ length: Math.floor((d - 8) / 2) }, (_, k) => TOP - (k + 1) * GAP) : []
        return (
          <g key={i} className="note">
            {ledgers.map((ly) => <line key={ly} className="ledger" x1={x - 13} x2={x + 13} y1={ly} y2={ly} />)}
            <ellipse cx={x} cy={ny} rx="7.5" ry="5" transform={`rotate(-20 ${x} ${ny})`} />
          </g>
        )
      })}
    </svg>
  )
}
