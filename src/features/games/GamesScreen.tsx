import { GAMES, levelId } from '../../games/catalog'
import { useProgress } from '../../progress/store'
import { Icon } from '../../ui/Icon'
import { en } from '../../i18n/en'

export function GamesScreen() {
  const p = useProgress()
  return (
    <div className="page">
      <h1>{en.gamesScreen.title}</h1>
      <p className="lede">{en.gamesScreen.subtitle}</p>
      <div className="card-grid">
        {Object.values(GAMES).map((g, i) => (
          <article key={g.id} className="card game-card">
            <div className={`game-art tone-${i}`} aria-hidden="true">
              <span className="game-glyph">{g.id === 'degrees' ? 'Do Re Mi' : '↕'}</span>
            </div>
            <h2>{g.title}</h2>
            <p>{g.blurb}</p>
            <ul className="level-chips">
              {g.levels.map((lv, l) => (
                <li key={l}>
                  <a className={`chip ${p.levels[levelId(g.id, l)]?.done ? 'done' : ''}`} href={`#/play/${g.id}/${l}`}
                    title={lv.title} aria-label={`${en.path.level} ${l + 1}: ${lv.title}`}>
                    {p.levels[levelId(g.id, l)]?.done && <Icon name="check" size={14} />} {l + 1}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
