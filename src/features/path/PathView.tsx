import { GAMES, currentNode, isUnlocked, levelId, reviewOpen, type Unit } from '../../games/catalog'
import { GameIcon } from '../../ui/GameIcon'
import { useProgress } from '../../progress/store'
import { level as stats } from '../../progress/progress'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { Pip } from '../../ui/Pip'
import { Stars } from '../../ui/Stars'
import { en } from '../../i18n/en'

const OFFSETS = [0, 64, 96, 64, 0, -64, -96, -64]
const SHAPES = ['pentagon', 'circle', 'triangle']
const TONES = ['yellow', 'pink', 'sky', 'green', 'iris']

/** Duolingo-style winding path of level nodes, shared by the Journey (home) and course pages */
export function PathView({ units, from }: { units: Unit[]; from: string }) {
  const p = useProgress()
  const cur = currentNode(p, units)
  let n = 0
  return (
    <div className="path">
      {units.map((unit, u) => {
        const ids = unit.nodes.map(([g, l]) => levelId(g, l))
        const doneCount = ids.filter((id) => stats(p, id).done).length
        return (
          <section key={u} className="unit">
            {unit.section && <h3 className="section-head"><span>{unit.section}</span></h3>}
            <div className={`unit-banner tone-${TONES[u % TONES.length]}`}>
              <div>
                <span className="tag">{unit.tag}</span>
                <h2>{unit.title}</h2>
              </div>
              <span className="unit-progress">{doneCount}/{ids.length}</span>
              <span className={`unit-shape ${SHAPES[u % 3]}`} aria-hidden="true" />
              <span className="unit-bar" style={{ width: `${(doneCount / ids.length) * 100}%` }} />
            </div>
            <span className={`shape deco ${SHAPES[(u + 1) % 3]} ${u % 2 ? 'left' : 'right'}`} aria-hidden="true" />
            <ol className="nodes">
              {unit.nodes.map(([g, l]) => {
                const i = n++
                const id = levelId(g, l)
                const s = stats(p, id)
                const isCurrent = !!cur && cur[0] === g && cur[1] === l
                const locked = !isUnlocked(p, g, l)
                const game = GAMES[g]
                return (
                  <li key={id} style={{ translate: `${OFFSETS[i % 8]}px 0`, animationDelay: `${Math.min(i, 12) * 40}ms` }}>
                    {isCurrent && (
                      <span className={`node-pip ${OFFSETS[i % 8] > 0 ? 'left' : 'right'}`} aria-hidden="true"><Pip mood="happy" size={64} /></span>
                    )}
                    {isCurrent && <span className="start-bubble" aria-hidden="true">{en.path.start}</span>}
                    <button className={`node world-node-${game.world} ${s.done ? 'done' : ''} ${isCurrent ? 'current' : ''} ${locked ? 'locked' : ''}`}
                      disabled={locked} aria-label={`${game.title} · ${en.path.level} ${l + 1}: ${game.levels[l].title}`}
                      onClick={() => go(`/level/${g}/${l}?from=${encodeURIComponent(from)}`)}>
                      {s.done ? <Icon name="check" size={32} /> : locked ? <Icon name="lock" size={26} /> : <span className="node-glyph"><GameIcon id={g} size={40} /></span>}
                    </button>
                    <Stars n={s.stars ?? 0} size={16} />
                    <span className="node-caption"><b>{game.title}</b>{game.levels[l].title}</span>
                  </li>
                )
              })}
              <ReviewNode unit={unit} offset={OFFSETS[n++ % 8]} />
            </ol>
          </section>
        )
      })}
    </div>
  )
}

/** The unit's review: unlocked when every level in it is done, passed at 80% (ADR-022) */
function ReviewNode({ unit, offset }: { unit: Unit; offset: number }) {
  const p = useProgress()
  const open = reviewOpen(p, unit)
  const done = !!p.reviews?.[unit.key]?.done
  return (
    <li style={{ translate: `${offset}px 0` }}>
      <button className={`node review-node ${done ? 'done' : open ? 'ready' : 'locked'}`} disabled={!open}
        aria-label={`${en.review.node}: ${open ? en.review.nodeHint : en.review.locked}`} onClick={() => go(`/review/${unit.key}`)}>
        <Icon name={open || done ? 'star' : 'lock'} size={30} />
      </button>
      <span className="node-caption"><b>{en.review.node}</b>{en.review.nodeHint}</span>
    </li>
  )
}
