import type { BadgeId } from '../progress/progress'
import { Icon, type IconName } from './Icon'

const LOOK: Record<BadgeId, [IconName, string]> = {
  firstLearn: ['book', 'var(--color-powder-sky)'],
  firstPlay: ['gamepad', 'var(--color-bubblegum-pink)'],
  triple: ['star', 'var(--color-hi-yellow)'],
  combo10: ['bolt', 'var(--color-jelly-green)'],
  streak3: ['flame', 'var(--color-marker-red)'],
  stars10: ['star', 'var(--color-powder-sky)'],
  explorer: ['games', 'var(--color-jelly-green)'],
  sectionA: ['check', 'var(--color-hi-yellow)'],
}

/** Paper-cut medallion: a pentagon in the badge color with its icon */
export function Badge({ id, earned, size = 72 }: { id: BadgeId; earned: boolean; size?: number }) {
  const [icon, color] = LOOK[id]
  return (
    <span className={`badge ${earned ? 'earned' : 'locked'}`} style={{ width: size, height: size, '--badge': color } as React.CSSProperties}>
      <Icon name={earned ? icon : 'lock'} size={size * 0.4} />
    </span>
  )
}
