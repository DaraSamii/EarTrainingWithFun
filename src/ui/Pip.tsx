export type Mood = 'idle' | 'talk' | 'happy' | 'think' | 'oops'

/** Pip: a paper-cut bird with headphones, built from DESIGN.md shapes (ADR-015) */
export function Pip({ mood = 'idle', size = 120 }: { mood?: Mood; size?: number }) {
  const happy = mood === 'happy'
  return (
    <svg className={`pip pip-${mood}`} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <g className="pip-body">
        <path d="M46 104l-6 10h12zM74 104l-6 10h12z" fill="var(--color-marker-red)" />
        <path d="M52 30L60 12l8 18z" fill="var(--color-marker-red)" />
        <circle cx="61" cy="70" r="40" fill="var(--color-ink-black)" />
        <circle cx="60" cy="66" r="40" fill="var(--color-hi-yellow)" />
        <circle cx="60" cy="80" r="23" fill="#fff1a8" />
        <path className="pip-wing" d="M22 74a15 15 0 0 0 30 0z" fill="var(--color-bubblegum-pink)" />
        <circle cx="36" cy="66" r="5" fill="var(--color-bubblegum-pink)" opacity=".8" />
        <circle cx="84" cy="66" r="5" fill="var(--color-bubblegum-pink)" opacity=".8" />
        {happy ? (
          <g stroke="var(--color-ink-black)" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M38 54q7-9 14 0M68 54q7-9 14 0" />
          </g>
        ) : (
          <g>
            <circle cx="45" cy="52" r="9" fill="#fff" />
            <circle cx="75" cy="52" r="9" fill="#fff" />
            <circle className="pip-pupil" cx={mood === 'think' ? 48 : 46} cy={mood === 'think' ? 48 : 53} r="4.5" fill="var(--color-ink-black)" />
            <circle className="pip-pupil" cx={mood === 'think' ? 78 : 76} cy={mood === 'think' ? 48 : 53} r="4.5" fill="var(--color-ink-black)" />
          </g>
        )}
        <path d="M53 62h14l-7 8z" fill="var(--color-marker-red)" />
        <path className="pip-beak-low" d="M55 70h10l-5 5z" fill="#d92f2f" />
        <path d="M18 64a42 42 0 0 1 84 0" fill="none" stroke="var(--color-electric-iris)" strokeWidth="7" />
        <rect x="9" y="56" width="16" height="26" rx="8" fill="var(--color-electric-iris)" />
        <rect x="95" y="56" width="16" height="26" rx="8" fill="var(--color-electric-iris)" />
      </g>
    </svg>
  )
}

export function Bubble({ children, side = 'left' }: { children: React.ReactNode; side?: 'left' | 'bottom' }) {
  return <div className={`bubble bubble-${side}`}>{children}</div>
}
