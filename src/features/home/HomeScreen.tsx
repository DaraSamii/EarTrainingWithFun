import { useState } from 'react'
import { CourseIcon } from '../../ui/GameIcon'
import { COURSES, GAMES, JOURNEY, courseMax, courseStars, currentNode } from '../../games/catalog'
import { setProgress, useProgress } from '../../progress/store'
import { GOALS, currentStreak, dayKey, setGoal, todayXp, totalStars, week, type Progress } from '../../progress/progress'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { Pip, Bubble } from '../../ui/Pip'
import { World } from '../../ui/World'
import { PathView } from '../path/PathView'
import { en } from '../../i18n/en'

type Panel = 'streak' | 'goal' | 'stars' | null

export function HomeScreen() {
  const p = useProgress()
  const today = dayKey()
  const [open, setOpen] = useState<Panel>(null)
  const [hello] = useState(() => en.home.hello[Math.floor(Math.random() * en.home.hello.length)])
  const streak = currentStreak(p, today)
  const xp = todayXp(p, today)
  const goal = Math.min(1, xp / p.dailyGoal)
  const cur = currentNode(p, JOURNEY)
  const toggle = (k: Panel) => setOpen((o) => (o === k ? null : k))

  return (
    <div className="home">
      <div className="home-main">
        <section className="greeting">
          <div className="greeting-pip">
            <Pip mood="idle" size={96} />
            <Bubble><p>{hello}</p></Bubble>
          </div>
          <ul className="taglines" aria-label={en.path.ticker}>
            {en.path.ticker.split(' • ').map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>

        {cur ? (
          <button className={`continue-card hero-${GAMES[cur[0]].world}`} onClick={() => go(`/level/${cur[0]}/${cur[1]}`)}>
            <World world={GAMES[cur[0]].world} />
            <span className="continue-inner">
              <span className="tag">{en.journey.continue}</span>
              <strong>{GAMES[cur[0]].title}</strong>
              <span>{en.path.level} {cur[1] + 1} · {GAMES[cur[0]].levels[cur[1]].title}</span>
            </span>
            <span className="continue-go"><Icon name="play" size={30} /></span>
          </button>
        ) : <p className="all-done">{en.journey.allDone}</p>}

        <header className="journey-head">
          <h1>{en.journey.title}</h1>
          <p>{en.journey.blurb}</p>
        </header>
        <PathView units={JOURNEY} from="/" />
      </div>

      <aside className="home-side">
        <div className="home-stats">
          <button className={`card home-stat streak-card ${streak ? 'on' : ''}`} aria-expanded={open === 'streak'} onClick={() => toggle('streak')}>
            <span className="home-stat-icon"><Icon name="flame" size={28} /></span>
            <strong>{streak}</strong>
            <span>{en.stats.streak}</span>
          </button>
          <button className="card home-stat goal-card" aria-expanded={open === 'goal'} onClick={() => toggle('goal')}>
            <svg viewBox="0 0 36 36" width="40" height="40" aria-hidden="true" className="goal-big">
              <circle cx="18" cy="18" r="15" className="ring-bg" />
              <circle cx="18" cy="18" r="15" className="ring-fg" strokeDasharray={`${goal * 94.25} 94.25`} />
            </svg>
            <strong>{xp}<small>/{p.dailyGoal}</small></strong>
            <span>{goal >= 1 ? en.home.goalDone : en.home.goalTitle}</span>
          </button>
          <button className="card home-stat stars-card" aria-expanded={open === 'stars'} onClick={() => toggle('stars')}>
            <span className="home-stat-icon"><Icon name="star" size={28} /></span>
            <strong>{totalStars(p)}</strong>
            <span>{en.home.starsTitle}</span>
          </button>
        </div>
        <div className={`stat-panel ${open ? 'open' : ''}`}>
          <div className="stat-panel-inner">
            {open === 'streak' && <StreakPanel p={p} today={today} streak={streak} />}
            {open === 'goal' && <GoalPanel p={p} today={today} />}
            {open === 'stars' && <StarsPanel p={p} />}
          </div>
        </div>

        <section className="card side-courses">
          <h2>{en.coursesScreen.title}</h2>
          <ul>
            {COURSES.map((c) => (
              <li key={c.id}>
                <button className={`course-row c-${c.color}`} onClick={() => go(`/course/${c.id}`)}>
                  <span className="course-dot"><CourseIcon id={c.id} size={34} /></span>
                  <span className="course-name">{c.title}<small>{c.blurb}</small></span>
                  <span className="course-stars"><Icon name="star" size={14} /> {courseStars(p, c)}/{courseMax(c)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  )
}

function StreakPanel({ p, today, streak }: { p: Progress; today: string; streak: number }) {
  const days = week(p, today)
  const safe = (p.xpDays?.[today] ?? 0) >= p.dailyGoal
  return (
    <div className="panel-streak">
      <div className="panel-big">
        <span className={`big-flame ${streak ? 'on' : ''}`}><Icon name="flame" size={56} /></span>
        <div><strong>{streak}</strong><span>{en.home.streakLong}</span></div>
      </div>
      <ol className="week">
        {days.map((d, i) => {
          const hit = d.xp >= p.dailyGoal
          return (
            <li key={d.day} className={`${hit ? 'hit' : ''} ${d.day === today ? 'today' : ''} ${d.future ? 'future' : ''}`}>
              <span>{en.home.week[i]}</span>
              <i>{hit ? <Icon name="flame" size={16} /> : null}</i>
            </li>
          )
        })}
      </ol>
      <p>{!streak ? en.home.streakNone : safe ? en.home.streakSafe : en.home.streakKeep}</p>
    </div>
  )
}

function GoalPanel({ p, today }: { p: Progress; today: string }) {
  const days = week(p, today)
  const max = Math.max(p.dailyGoal * 1.25, ...days.map((d) => d.xp))
  return (
    <div className="panel-goal">
      <h3>{en.home.goalPick}</h3>
      <div className="goal-options" role="radiogroup" aria-label={en.home.goalPick}>
        {GOALS.map((g) => (
          <button key={g} role="radio" aria-checked={p.dailyGoal === g} onClick={() => setProgress(setGoal(p, g))}>
            <strong>{en.home.goals[g]}</strong><span>{g} {en.home.xpPerDay}</span>
          </button>
        ))}
      </div>
      <h3>{en.home.last7}</h3>
      <div className="bars" role="img" aria-label={days.map((d) => `${d.day}: ${d.xp} XP`).join(', ')}>
        <span className="goal-line" style={{ bottom: `${(p.dailyGoal / max) * 100}%` }} />
        {days.map((d, i) => (
          <div key={d.day} className={`xp-bar ${d.xp >= p.dailyGoal ? 'hit' : ''}`}>
            <span style={{ height: `${(d.xp / max) * 100}%` }} />
            <small>{en.home.week[i]}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

function StarsPanel({ p }: { p: Progress }) {
  return (
    <div className="panel-stars">
      <h3>{en.home.starsBy}</h3>
      <ul>
        {COURSES.map((c) => {
          const s = courseStars(p, c)
          const m = courseMax(c)
          return (
            <li key={c.id}>
              <button className={`c-${c.color}`} onClick={() => go(`/course/${c.id}`)}>
                <span>{c.title}</span>
                <span className="meter"><i style={{ width: `${(s / m) * 100}%` }} /></span>
                <small>{s}/{m}</small>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
