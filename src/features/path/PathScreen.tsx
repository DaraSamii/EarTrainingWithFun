import { GAMES, PATH, levelId } from '../../games/catalog'
import { useProgress } from '../../progress/store'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { en } from '../../i18n/en'

const OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56]
const SHAPES = ['pentagon', 'circle', 'triangle']

export function PathScreen() {
  const p = useProgress()
  const flat = PATH.flatMap((u) => u.nodes.map(([g, l]) => levelId(g, l)))
  const current = flat.findIndex((id) => !p.levels[id]?.done)
  let n = 0

  return (
    <div className="path">
      <p className="eyebrow">{en.path.section}</p>
      {PATH.map((unit, u) => (
        <section key={unit.title} className="unit">
          <div className={`unit-banner tone-${u}`}>
            <span className="tag">{en.path.unit} {u + 1}</span>
            <h2>{unit.title}</h2>
          </div>
          <span className={`shape deco ${SHAPES[u % 3]} ${u % 2 ? 'left' : 'right'}`} aria-hidden="true" />
          <ol className="nodes">
            {unit.nodes.map(([g, l]) => {
              const i = n++
              const id = levelId(g, l)
              const done = p.levels[id]?.done
              const isCurrent = i === current
              const locked = current !== -1 && i > current
              const label = `${GAMES[g].title} · ${en.path.level} ${l + 1}: ${GAMES[g].levels[l].title}`
              return (
                <li key={id} style={{ translate: `${OFFSETS[i % 8]}px 0` }}>
                  {isCurrent && <span className="start-bubble" aria-hidden="true">{en.path.start}</span>}
                  <button
                    className={`node ${done ? 'done' : ''} ${isCurrent ? 'current' : ''} ${locked ? 'locked' : ''}`}
                    disabled={locked}
                    aria-label={label}
                    onClick={() => go(`/play/${g}/${l}`)}
                  >
                    {done ? <Icon name="check" size={30} /> : locked ? <Icon name="lock" size={26} />
                      : <span className="node-glyph">{g === 'degrees' ? 'Do' : '↕'}</span>}
                  </button>
                  <span className="node-caption">{GAMES[g].levels[l].title}</span>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
      <section className="unit">
        <div className="unit-banner soon">
          <span className="tag">{en.path.soon}</span>
          <h2>{en.path.soonGames.join(' · ')}</h2>
        </div>
        <ol className="nodes">
          {en.path.soonGames.map((g, i) => (
            <li key={g} style={{ translate: `${OFFSETS[i % 8]}px 0` }}>
              <button className="node locked" disabled aria-label={`${g}: ${en.path.soon}`}><Icon name="lock" size={26} /></button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
