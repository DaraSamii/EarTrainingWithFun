import type { CourseId, GameId } from '../games/types'

/** Filled, slightly tilted note head */
const Head = ({ x, y, r = 5 }: { x: number; y: number; r?: number }) => (
  <ellipse cx={x} cy={y} rx={r + 1.4} ry={r} transform={`rotate(-22 ${x} ${y})`} fill="currentColor" stroke="none" />
)

const ART: Record<string, React.ReactNode> = {
  // tuning fork with sound waves
  fork: <>
    <path d="M16 5v15a7 7 0 0 0 14 0V5" /><path d="M23 27v16" /><circle cx="23" cy="43" r="1.5" fill="currentColor" />
    <path d="M36 9a7 7 0 0 1 0 12" /><path d="M40 5a13 13 0 0 1 0 20" />
  </>,
  // two notes with a measuring bracket between them
  interval: <>
    <Head x={12} y={36} /><Head x={36} y={12} />
    <path d="M24 9v30" strokeDasharray="3 4" /><path d="M20 9h8M20 39h8" />
  </>,
  // notes climbing a staircase
  stairs: <>
    <path d="M4 44h10v-9h10v-9h10v-9h10" />
    <Head x={9} y={38} r={3.6} /><Head x={19} y={29} r={3.6} /><Head x={29} y={20} r={3.6} /><Head x={39} y={11} r={3.6} />
  </>,
  // a flowing melodic line with notes on it
  melody: <>
    <path d="M4 34C12 10 20 10 25 24s13 16 19-6" />
    <Head x={7} y={27} r={3.8} /><Head x={17} y={15} r={3.8} /><Head x={29} y={30} r={3.8} /><Head x={41} y={22} r={3.8} />
  </>,
  // a stacked chord on a staff
  chord: <>
    <path d="M4 14h40M4 24h40M4 34h40" strokeWidth="1.6" opacity=".45" />
    <Head x={21} y={34} /><Head x={21} y={24} /><Head x={21} y={14} /><path d="M27.5 33V4" />
  </>,
  // drum with crossed sticks
  drum: <>
    <ellipse cx="24" cy="22" rx="15" ry="6" /><path d="M9 22v13c0 3.3 6.7 6 15 6s15-2.7 15-6V22" /><path d="M14 27l5 12M29 39l5-12" opacity=".6" />
    <path d="M10 4l13 15M38 4L25 19" /><circle cx="10" cy="4" r="2.5" fill="currentColor" /><circle cx="38" cy="4" r="2.5" fill="currentColor" />
  </>,
  // metronome
  metronome: <>
    <path d="M15 43l6-37h6l6 37z" /><path d="M10 43h28" /><path d="M24 35l9-22" /><rect x="27.5" y="18" width="6" height="5" rx="1" transform="rotate(22 30.5 20.5)" fill="currentColor" />
  </>,
  // up and down arrows
  updown: <>
    <path d="M15 42V8M7 16l8-8 8 8" /><path d="M33 6v34M25 32l8 8 8-8" />
  </>,
  // tuner dial with needle
  tuner: <>
    <path d="M6 34a18 18 0 0 1 36 0" /><path d="M24 16v4M10 22l3 3M38 22l-3 3" /><path d="M24 34l7-15" /><circle cx="24" cy="34" r="3" fill="currentColor" />
    <path d="M6 40h36" />
  </>,
  // two notes sounding together
  dyad: <>
    <Head x={19} y={32} /><Head x={19} y={20} /><path d="M25.5 31V4" /><path d="M33 26h9M33 32h9" />
  </>,
  // home with a note inside: the tonic
  home: <>
    <path d="M6 22L24 7l18 15v20H6z" /><Head x={21} y={34} r={4} /><path d="M26.5 33V20" />
  </>,
  // melody with one note circled
  spot: <>
    <path d="M6 32l10-10 10 6 12-14" strokeWidth="2" opacity=".5" />
    <Head x={6} y={32} r={3.6} /><Head x={16} y={22} r={3.6} /><Head x={26} y={28} r={3.6} /><Head x={38} y={14} r={3.6} />
    <circle cx="26" cy="28" r="9" strokeDasharray="4 3" />
  </>,
  // chord blocks connected by arrows
  progression: <>
    <rect x="3" y="15" width="10" height="18" rx="3" /><rect x="19" y="15" width="10" height="18" rx="3" /><rect x="35" y="15" width="10" height="18" rx="3" />
    <path d="M14 24h4M30 24h4" />
  </>,
  // chord ending at a final double bar line
  cadence: <>
    <Head x={14} y={34} /><Head x={14} y={24} /><Head x={14} y={14} /><path d="M20.5 33V6" /><path d="M34 6v36" /><path d="M41 6v36" strokeWidth="5" />
  </>,
  // beat grid
  grid: <>
    <rect x="4" y="17" width="8" height="14" rx="2" fill="currentColor" /><rect x="15" y="17" width="8" height="14" rx="2" />
    <rect x="26" y="17" width="8" height="14" rx="2" fill="currentColor" /><rect x="37" y="17" width="8" height="14" rx="2" fill="currentColor" />
    <path d="M4 38h41" strokeWidth="2" />
  </>,
  // crescendo hairpin, soft to loud
  hairpin: <>
    <path d="M12 24L42 12M12 24l30 12" />
    <text x="2" y="30" fontSize="16" fontStyle="italic" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Georgia, serif">p</text>
  </>,
  // staff with two notes: read the interval
  readint: <>
    <path d="M4 12h40M4 20h40M4 28h40M4 36h40" strokeWidth="1.6" opacity=".45" />
    <Head x={15} y={32} /><Head x={33} y={16} />
  </>,
  // two identical notes: the twin
  twins: <>
    <Head x={12} y={30} /><path d="M18.5 29V8" /><Head x={36} y={30} /><path d="M42.5 29V8" /><path d="M22 20h8M22 26h8" />
  </>,
  // two jumps of different size
  compareJumps: <>
    <path d="M4 40h18M4 40l7-8 7-14" /><path d="M26 40h18M26 40l9-28" strokeWidth="3.4" /><circle cx="35" cy="12" r="3" fill="currentColor" />
  </>,
  // half sun (major), half rain cloud (minor)
  mood: <>
    <circle cx="16" cy="18" r="8" /><path d="M16 4v3M5 9l2 2M2 18h3M27 9l-2 2" />
    <path d="M24 30a7 7 0 0 1 13-3 6 6 0 1 1 3 11H25a5 5 0 0 1-1-8z" /><path d="M28 42l-2 4M34 42l-2 4" />
  </>,
  // a step and a leap
  motion: <>
    <path d="M4 40h12v-8h8" /><Head x={10} y={36} r={3.4} /><Head x={20} y={28} r={3.4} />
    <path d="M26 30c4-20 12-20 16-20" strokeDasharray="3 3" /><Head x={41} y={10} r={3.4} />
  </>,
  // a chord with a count bubble
  count: <>
    <Head x={14} y={36} r={4.5} /><Head x={14} y={27} r={4.5} /><Head x={14} y={18} r={4.5} /><path d="M20 35V6" />
    <circle cx="35" cy="16" r="10" /><text x="31" y="21" fontSize="14" fill="currentColor" stroke="none" fontFamily="var(--font-display)">3</text>
  </>,
  // speedometer
  speed: <>
    <path d="M6 36a18 18 0 1 1 36 0" /><path d="M24 36l10-12" strokeWidth="3.4" /><circle cx="24" cy="36" r="3" fill="currentColor" />
    <path d="M10 26l3 1M24 18v3M38 26l-3 1" />
  </>,
  // instrument families: four grouped circles
  families: <>
    <circle cx="15" cy="15" r="8" /><circle cx="33" cy="15" r="8" fill="currentColor" fillOpacity=".25" /><circle cx="15" cy="33" r="8" fill="currentColor" fillOpacity=".25" /><circle cx="33" cy="33" r="8" />
  </>,
  // sharp sign
  sharp: <>
    <path d="M18 6v38M30 4v38" /><path d="M12 19l24-6M12 33l24-6" strokeWidth="5" />
  </>,
}

/** Glyphs the user approved as they are (0.4.0 review): treble clef and violin */
const TEXT: Partial<Record<string, string>> = { clef: '𝄞', violin: '🎻' }

const GAME_ART: Record<GameId, string> = {
  pitch: 'updown', tuneup: 'tuner', intervals: 'interval', harmonic: 'dyad', degrees: 'home', scales: 'stairs',
  contour: 'melody', spot: 'spot', chords: 'chord', progressions: 'progression', cadences: 'cadence',
  rhythm: 'grid', meter: 'metronome', timbre: 'violin', expression: 'hairpin', notes: 'clef', intreader: 'readint', keysigs: 'sharp',
  memory: 'twins', compare: 'compareJumps', mood: 'mood', motion: 'motion', count: 'count', tempo: 'speed', families: 'families',
}
const COURSE_ART: Record<CourseId, string> = {
  pitch: 'fork', intervals: 'interval', scales: 'stairs', melody: 'melody', harmony: 'chord', rhythm: 'drum', sounds: 'violin', theory: 'clef',
}

function Art({ art, size }: { art: string; size: number }) {
  const t = TEXT[art]
  if (t) return <span className={`icon-text icon-${art}`} style={{ fontSize: size * 0.82 }} aria-hidden="true">{t}</span>
  return (
    <svg className="game-icon" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {ART[art]}
    </svg>
  )
}

export const GameIcon = ({ id, size = 32 }: { id: GameId; size?: number }) => <Art art={GAME_ART[id]} size={size} />
export const CourseIcon = ({ id, size = 32 }: { id: CourseId; size?: number }) => <Art art={COURSE_ART[id]} size={size} />
