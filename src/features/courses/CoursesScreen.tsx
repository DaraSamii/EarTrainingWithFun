import { COURSES, GAMES, courseMax, courseStars, coursePath } from '../../games/catalog'
import { CourseIcon, GameIcon } from '../../ui/GameIcon'
import { useProgress } from '../../progress/store'
import { go } from '../../app/router'
import { Icon } from '../../ui/Icon'
import { World } from '../../ui/World'
import { PathView } from '../path/PathView'
import { ExitBar } from '../../ui/ExitBar'
import { en } from '../../i18n/en'

export function CoursesScreen() {
  const p = useProgress()
  return (
    <div className="page">
      <h1>{en.coursesScreen.title}</h1>
      <p className="lede">{en.coursesScreen.subtitle}</p>
      <div className="card-grid">
        {COURSES.map((c, i) => {
          const s = courseStars(p, c)
          const m = courseMax(c)
          return (
            <button key={c.id} className={`card course-card c-${c.color}`} style={{ animationDelay: `${i * 50}ms` }} onClick={() => go(`/course/${c.id}`)}>
              <div className="course-art"><World world={GAMES[c.games[0]].world} /><span className="course-glyph"><CourseIcon id={c.id} size={46} /></span></div>
              <h2>{c.title}</h2>
              <p>{c.blurb}</p>
              <span className="course-games">{c.games.map((g) => GAMES[g].title).join(' · ')}</span>
              <span className="meter"><i style={{ width: `${(s / m) * 100}%` }} /></span>
              <span className="course-foot"><Icon name="star" size={16} /> {s}/{m} <span className="course-open">{en.coursesScreen.open} <Icon name="chevron" size={16} /></span></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function CourseScreen({ id }: { id: string }) {
  const c = COURSES.find((x) => x.id === id) ?? COURSES[0]
  const p = useProgress()
  return (
    <div className="course-page">
      <header className={`course-hero hero-${GAMES[c.games[0]].world}`}>
        <World world={GAMES[c.games[0]].world} />
        <ExitBar back="/courses" onWorld />
        <div className="level-hero-inner">
          <span className="tag">{en.coursesScreen.title}</span>
          <h1>{c.title}</h1>
          <p>{c.blurb}</p>
          <span className="course-foot"><Icon name="star" size={16} /> {courseStars(p, c)}/{courseMax(c)}</span>
        </div>
      </header>
      <div className="course-body">
        <div className="course-game-list">
          {c.games.map((g) => (
            <div key={g} className="card mini-game">
              <span className="course-dot"><GameIcon id={g} size={34} /></span>
              <div><strong>{GAMES[g].title}</strong><p>{GAMES[g].blurb}</p></div>
            </div>
          ))}
        </div>
        <PathView units={coursePath(c)} from={`/course/${c.id}`} />
      </div>
    </div>
  )
}
