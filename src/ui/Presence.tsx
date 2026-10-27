import { useState } from 'react'

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Keeps content mounted while it animates out, so nothing ever disappears abruptly (user feedback 0.8.0).
 * While leaving it shows the last content it had.
 */
export function Presence({ show, className = '', children }: { show: boolean; className?: string; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(show)
  const [kept, setKept] = useState(children)
  // adjust state from props during render (React's recommended pattern, no effect needed)
  if (show && !mounted) setMounted(true)
  if (show && children !== kept) setKept(children)
  if (!show && mounted && reduced()) setMounted(false)
  if (!mounted) return null
  return (
    <div className={`presence ${show ? 'p-in' : 'p-out'} ${className}`}
      onAnimationEnd={(e) => { if (!show && e.target === e.currentTarget) setMounted(false) }}>
      {show ? children : kept}
    </div>
  )
}
