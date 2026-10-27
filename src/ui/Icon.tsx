const PATHS = {
  play: 'M8 5.5v13l11-6.5z',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9h-13z',
  flame: 'M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5.5 1 1.5 2 2 2 2S10 6 12 3z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  path: 'M12 3v4M12 11v2M12 17v4M7 7h10M5 13h14',
  games: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  key: 'M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  ear: 'M7 9a5 5 0 1 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5 1M10 10a2 2 0 1 1 4 0',
} as const

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const filled = name === 'play' || name === 'flame' || name === 'bolt'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  )
}
