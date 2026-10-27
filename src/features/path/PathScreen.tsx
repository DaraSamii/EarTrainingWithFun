import { useState } from 'react'
import { GAMES, PATH, PATH_IDS, currentIndex, levelId } from '../../games/catalog'
import { useProgress } from '../../progress/store'
import { currentStreak, dayKey, level as stats, todayXp, totalStars } from '../../progress/progress'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { Pip, Bubble } from '../../ui/Pip'
import { Stars } from '../../ui/Stars'
import { en } from '../../i18n/en'

const OFFSETS = [0, 64, 96, 64, 0, -64, -96, -64]
const SHAPES = ['pentagon', 'circle', 'triangle']

export function PathScreen() {
  const p = useProgress()
  const today = dayKey()
  const current = currentIndex(p)
  const streak = currentStreak(p, today)
  const xpToday = todayXp(p, today)
  const goal = Math.min(1, xpToday / p.dailyGoal)
  const [hello] = useState(() => en.home.hello[Math.floor(Math.random() * en.home.hello.length)])
  let n = 0

  return (
    <div className="home">
      <div className="ticker" aria-hidden="true"><span>{`${en.path.ticker} • `.repeat(6)}</span></div>

      <section className="greeting">
        <div className="greeting-pip">
          <Pip mood="idle" size={104} />
          <Bubble><p>{hello}</p></Bubble>
        </div>
        <div className="home-stats">
          <div className={`card home-stat streak-card ${streak ? 'on' : ''}`}>
            <span className="home-stat-icon"><Icon name="flame" size={28} /></span>
            <strong>{streak}</strong>
            <span>{en.stats.streak}</span>
          </div>
          <div className="card home-stat goal-card">
            <svg viewBox="0 0 36 36" width="44" height="44" aria-hidden="true" className="goal-big">
              <circle cx="18" cy="18" r="15" className="ring-bg" />
              <circle cx="18" cy="18" r="15" className="ring-fg" strokeDasharray={`${goal * 94.25} 94.25`} />
            </svg>
            <strong>{xpToday}<small>/{p.dailyGoal}</small></strong>
            <span>{goal >= 1 ? en.home.goalDone : en.home.goalTitle}</span>
          </div>
          <div className="card home-stat stars-card">
            <span className="home-stat-icon"><Icon name="star" size={28} /></span>
            <strong>{totalStars(p)}<small>/{PATH_IDS.length * 3}</small></strong>
            <span>{en.home.starsTitle}</span>
          </div>
        </div>
      </section>

      <div className="path">
        <p className="eyebrow">{en.path.section}</p>
        {PATH.map((unit, u) => {
          const ids = unit.nodes.map(([g, l]) => levelId(g, l))
          const doneCount = ids.filter((id) => stats(p, id).done).length
          return (
            <section key={unit.title} className="unit">
              <div className={`unit-banner tone-${u}`}>
                <div>
                  <span className="tag">{en.path.unit} {u + 1}</span>
                  <h2>{unit.title}</h2>
                </div>
                <span className="unit-progress">{doneCount}/{ids.length}</span>
                <span className={`unit-shape ${SHAPES[u % 3]}`} aria-hidden="true" />
              </div>
              <span className={`shape deco ${SHAPES[(u + 1) % 3]} ${u % 2 ? 'left' : 'right'}`} aria-hidden="true" />
              <ol className="nodes">
                {unit.nodes.map(([g, l]) => {
                  const i = n++
                  const id = levelId(g, l)
                  const s = stats(p, id)
                  const isCurrent = i === current
                  const locked = current !== -1 && i > current
                  const label = `${GAMES[g].title} · ${en.path.level} ${l + 1}: ${GAMES[g].levels[l].title}`
                  return (
                    <li key={id} style={{ translate: `${OFFSETS[i % 8]}px 0` }}>
                      {isCurrent && (
                        <span className={`node-pip ${OFFSETS[i % 8] > 0 ? 'left' : 'right'}`} aria-hidden="true">
                          <Pip mood="happy" size={64} />
                        </span>
                      )}
                      {isCurrent && <span className="start-bubble" aria-hidden="true">{en.path.start}</span>}
                      <button
                        className={`node node-${g} ${s.done ? 'done' : ''} ${isCurrent ? 'current' : ''} ${locked ? 'locked' : ''}`}
                        disabled={locked} aria-label={label} onClick={() => go(`/level/${g}/${l}`)}>
                        {s.done ? <Icon name="check" size={32} /> : locked ? <Icon name="lock" size={26} />
                          : <span className="node-glyph">{g === 'degrees' ? 'Do' : '↕'}</span>}
                      </button>
                      <Stars n={s.stars ?? 0} size={16} />
                      <span className="node-caption">{GAMES[g].levels[l].title}</span>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
        <section className="unit">
          <div className="unit-banner soon">
            <div>
              <span className="tag">{en.path.soon}</span>
              <h2>{en.path.soonGames.join(' · ')}</h2>
            </div>
          </div>
          <ol className="nodes">
            {en.path.soonGames.map((g, i) => (
              <li key={g} style={{ translate: `${OFFSETS[i % 8]}px 0` }}>
                <button className="node locked" disabled aria-label={`${g}: ${en.path.soon}`}><Icon name="lock" size={26} /></button>
                <span className="node-caption">{g}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
