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
      {world === 'river' && <>{N(2, 'w-cloud')}<span className="w-bank b1" /><span className="w-bank b2" /><span className="w-stream" />{N(3, 'w-pine')}<span className="w-paperboat" /></>}
      {world === 'lab' && <>{N(3, 'w-shelf')}{N(7, 'w-flask')}<span className="w-window" /><span className="w-bigflask" /></>}
      {world === 'track' && <><span className="w-stands" />{N(12, 'w-fan')}<span className="w-lanes" /><span className="w-finish" /><span className="w-sun track-sun" /></>}
      {world === 'pond' && <><span className="w-water" />{N(4, 'w-pad')}{N(3, 'w-reed')}<span className="w-koi k1" /><span className="w-koi k2" />{N(2, 'w-ripple')}</>}
    </div>
  )
}
