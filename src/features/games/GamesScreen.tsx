import { GAMES, isUnlocked, levelId } from '../../games/catalog'
import { useProgress } from '../../progress/store'
import { level as stats } from '../../progress/progress'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { Stars } from '../../ui/Stars'
import { World } from '../../ui/World'
import { en } from '../../i18n/en'

export function GamesScreen() {
  const p = useProgress()
  return (
    <div className="page">
      <h1>{en.gamesScreen.title}</h1>
      <p className="lede">{en.gamesScreen.subtitle}</p>
      <div className="card-grid">
        {Object.values(GAMES).map((g) => (
          <article key={g.id} className={`card game-card theme-${g.id}`}>
            <div className={`game-art hero-${g.id}`} aria-hidden="true">
              <World game={g.id} />
              <span className="tag world-tag">{g.world}</span>
            </div>
            <h2>{g.title}</h2>
            <p>{g.blurb}</p>
            <ul className="level-list">
              {g.levels.map((lv, l) => {
                const id = levelId(g.id, l)
                const s = stats(p, id)
                const open = isUnlocked(p, id)
                return (
                  <li key={l}>
                    <button className={`level-row ${s.done ? 'done' : ''}`} disabled={!open} onClick={() => go(`/level/${g.id}/${l}`)}>
                      <span className="level-num">{open ? l + 1 : <Icon name="lock" size={16} />}</span>
                      <span className="level-name">{lv.title}</span>
                      <Stars n={s.stars ?? 0} size={16} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
