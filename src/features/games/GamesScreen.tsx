import { useState } from 'react'
import { CourseIcon, GameIcon } from '../../ui/GameIcon'
import { COURSES, GAMES, isUnlocked, levelId, type Game } from '../../games/catalog'
import { useProgress } from '../../progress/store'
import { level as stats } from '../../progress/progress'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { Stars } from '../../ui/Stars'
import { World } from '../../ui/World'
import { en } from '../../i18n/en'
import { animate } from '../../app/motion'

function GameCard({ g, i }: { g: Game; i: number }) {
  const p = useProgress()
  return (
    <article className="card game-card" style={{ animationDelay: `${i * 50}ms` }}>
      <div className={`game-art hero-${g.world}`} aria-hidden="true">
        <World world={g.world} />
        <span className="tag world-tag">{g.worldName}</span>
        <span className="game-glyph-big"><GameIcon id={g.id} size={46} /></span>
      </div>
      <h2>{g.title}</h2>
      <p>{g.blurb}</p>
      <ul className="level-list">
        {g.levels.map((lv, l) => {
          const s = stats(p, levelId(g.id, l))
          const open = isUnlocked(p, g.id, l)
          return (
            <li key={l}>
              <button className={`level-row ${s.done ? 'done' : ''}`} disabled={!open} onClick={() => go(`/level/${g.id}/${l}?from=/games`)}>
                <span className="level-num">{open ? l + 1 : <Icon name="lock" size={16} />}</span>
                <span className="level-name">{lv.title}</span>
                <Stars n={s.stars ?? 0} size={16} />
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function GamesScreen() {
  const [mode, setMode] = useState<'course' | 'all'>('course')
  let i = 0
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{en.gamesScreen.title}</h1>
          <p className="lede">{en.gamesScreen.subtitle}</p>
        </div>
        <div className="segmented" role="radiogroup" aria-label={en.gamesScreen.title}>
          {(['course', 'all'] as const).map((m) => (
            <button key={m} role="radio" aria-checked={mode === m} onClick={() => animate(() => setMode(m))}>
              {m === 'course' ? en.gamesScreen.byCourse : en.gamesScreen.all}
            </button>
          ))}
        </div>
      </div>
      {mode === 'all' ? (
        <div className="card-grid">{Object.values(GAMES).map((g) => <GameCard key={g.id} g={g} i={i++} />)}</div>
      ) : COURSES.map((c) => (
        <section key={c.id} className="games-group">
          <button className={`group-head c-${c.color}`} onClick={() => go(`/course/${c.id}`)}>
            <span className="course-dot"><CourseIcon id={c.id} size={34} /></span>
            <h2>{c.title}</h2><span>{c.blurb}</span><Icon name="chevron" size={18} />
          </button>
          <div className="card-grid">{c.games.map((g) => <GameCard key={g} g={GAMES[g]} i={i++} />)}</div>
        </section>
      ))}
    </div>
  )
}
