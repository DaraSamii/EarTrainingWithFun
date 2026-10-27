import { useRoute } from './router'
import { useProgress } from '../progress/store'
import { currentStreak, dayKey, todayXp } from '../progress/progress'
import { Icon, type IconName } from '../ui/Icon'
import { ThemeToggle } from '../ui/ThemeToggle'
import { HomeScreen } from '../features/home/HomeScreen'
import { CourseScreen, CoursesScreen } from '../features/courses/CoursesScreen'
import { GamesScreen } from '../features/games/GamesScreen'
import { ProfileScreen } from '../features/profile/ProfileScreen'
import { LessonScreen } from '../features/lesson/LessonScreen'
import { LevelScreen } from '../features/level/LevelScreen'
import { LearnScreen } from '../features/learn/LearnScreen'
import { PlayScreen } from '../features/arcade/PlayScreen'
import { ReviewScreen } from '../features/review/ReviewScreen'
import { NotebookScreen } from '../features/notebook/NotebookScreen'
import { WelcomeScreen } from '../features/welcome/WelcomeScreen'
import { welcomed } from './settings'
import { GAMES, isUnlocked, levelId, stepOpen, type GameId, type Step3 } from '../games/catalog'
import { en } from '../i18n/en'

const TABS: [string, IconName, string][] = [
  ['/', 'home', en.nav.path],
  ['/courses', 'map', en.nav.courses],
  ['/games', 'games', en.nav.games],
  ['/notebook', 'book', en.nav.notebook],
  ['/profile', 'profile', en.nav.profile],
]

export default function App() {
  const route = useRoute()
  const p = useProgress()
  const m = route.match(/^\/(level|learn|practice|play)\/(\w+)\/(\d+)$/)
  if (m && m[2] in GAMES && GAMES[m[2] as GameId].levels[+m[3]]) {
    const [, screen, g, l] = m as unknown as [string, 'level' | Step3, GameId, string]
    // guard: no step can be opened before its prerequisites (ADR-013)
    const open = screen === 'level' || (isUnlocked(p, g, +l) && stepOpen(p, levelId(g, +l), screen))
    const props = { key: route, gameId: g, level: +l }
    if (!open || screen === 'level') return <LevelScreen {...props} />
    if (screen === 'learn') return <LearnScreen {...props} />
    if (screen === 'practice') return <LessonScreen {...props} />
    return <PlayScreen {...props} />
  }
  // first visit: show what the app can do before anything else
  if (route === '/welcome' || (route === '/' && !welcomed() && p.xp === 0 && !Object.keys(p.levels).length))
    return <div className="shell page-enter" key="welcome"><WelcomeScreen /></div>
  const review = route.match(/^\/review\/([\w-]+)$/)
  if (review) return <ReviewScreen key={route} scope={review[1]} />
  const course = route.match(/^\/course\/(\w+)$/)
  if (course) return <div className="shell page-enter" key={route}><CourseScreen id={course[1]} /></div>

  const tab = TABS.find(([path]) => path === route)?.[0] ?? '/'
  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="icon-mark small" aria-hidden="true"><Icon name="ear" size={20} /></span>
          <span className="brand-name">{en.appName}</span>
        </a>
        <nav className="tabs" aria-label="Main">
          {TABS.map(([path, icon, label]) => (
            <a key={path} href={`#${path}`} className="tab" aria-current={tab === path ? 'page' : undefined}>
              <Icon name={icon} /> <span>{label}</span>
            </a>
          ))}
        </nav>
        <Stats />
        <ThemeToggle />
      </header>
      <main className="content page-enter" key={tab}>
        {tab === '/courses' ? <CoursesScreen /> : tab === '/games' ? <GamesScreen /> : tab === '/notebook' ? <NotebookScreen />
          : tab === '/profile' ? <ProfileScreen /> : <HomeScreen />}
      </main>
    </div>
  )
}

function Stats() {
  const p = useProgress()
  const today = dayKey()
  const streak = currentStreak(p, today)
  return (
    <a className="stats" href="#/" aria-label={`${streak} ${en.stats.streak}, ${p.xp} ${en.stats.xp}`}>
      <span className={`stat streak ${streak ? 'on' : ''}`}><Icon name="flame" size={20} /> {streak}</span>
      <span className="stat xp"><Icon name="bolt" size={20} /> {p.xp}</span>
      <span className="stat goal-mini" aria-hidden="true">
        <svg viewBox="0 0 36 36" width="28" height="28">
          <circle cx="18" cy="18" r="15" className="ring-bg" />
          <circle cx="18" cy="18" r="15" className="ring-fg" strokeDasharray={`${Math.min(1, todayXp(p, today) / p.dailyGoal) * 94.25} 94.25`} />
        </svg>
      </span>
    </a>
  )
}
