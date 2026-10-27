import type { WorldId } from '../games/types'

const N = (n: number, cls: string) => Array.from({ length: n }, (_, i) => <span key={cls + i} className={`${cls} ${cls}${i}`} />)

/** Paper-cut scenery for each game's world (ADR-015). Purely decorative. */
export function World({ world }: { world: WorldId }) {
  return (
    <div className={`world world-${world}`} aria-hidden="true">
      {world === 'garden' && <>
        <span className="w-sun" />{N(2, 'w-cloud')}<span className="w-hill h1" /><span className="w-hill h2" />
        {N(2, 'w-tri')}{N(2, 'w-flower')}
      </>}
      {world === 'space' && <>{N(14, 'w-star')}<span className="w-planet p1" /><span className="w-planet p2" /><span className="w-moon" /></>}
      {world === 'ocean' && <>{N(3, 'w-wave')}{N(7, 'w-bubble')}<span className="w-fish f1" /><span className="w-fish f2" /><span className="w-weed" /></>}
      {world === 'mountains' && <><span className="w-sun peak-sun" />{N(3, 'w-peak')}{N(3, 'w-bird')}{N(2, 'w-cloud')}</>}
      {world === 'notebook' && <><span className="w-margin" />{N(3, 'w-sticky')}<span className="w-pencil" />{N(4, 'w-doodle')}</>}
    </div>
  )
}
