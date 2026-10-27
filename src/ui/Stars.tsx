export function Stars({ n, size = 20, pop = false }: { n: number; size?: number; pop?: boolean }) {
  return (
    <span className={`stars ${pop ? 'pop' : ''}`} role="img" aria-label={`${n} / 3`}>
      {[0, 1, 2].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className={i < n ? 'on' : 'off'} style={{ animationDelay: `${0.35 + i * 0.35}s` }}>
          <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" />
        </svg>
      ))}
    </span>
  )
}
