import { useRoute, go } from './router'
import { useProgress } from '../progress/store'
import { currentStreak, dayKey, todayXp } from '../progress/progress'
import { Icon, type IconName } from '../ui/Icon'
import { PathScreen } from '../features/path/PathScreen'
import { GamesScreen } from '../features/games/GamesScreen'
import { ProfileScreen } from '../features/profile/ProfileScreen'
import { LessonScreen } from '../features/lesson/LessonScreen'
import { LevelScreen } from '../features/level/LevelScreen'
import { LearnScreen } from '../features/learn/LearnScreen'
import { PlayScreen } from '../features/arcade/PlayScreen'
import { GAMES, isUnlocked, levelId, stepOpen, type GameId, type Step3 } from '../games/catalog'
import { en } from '../i18n/en'

const TABS: [string, IconName, string][] = [
  ['/', 'path', en.nav.path],
  ['/games', 'games', en.nav.games],
  ['/profile', 'profile', en.nav.profile],
]

export default function App() {
  const route = useRoute()
  const p = useProgress()
  const m = route.match(/^\/(level|learn|practice|play)\/(\w+)\/(\d+)$/)
  if (m && m[2] in GAMES && GAMES[m[2] as GameId].levels[+m[3]]) {
    const [, screen, g, l] = m as unknown as [string, 'level' | Step3, GameId, string]
    const id = levelId(g, +l)
    // guard: no step can be opened before its prerequisites (ADR-013)
    const open = screen === 'level' || (isUnlocked(p, id) && stepOpen(p, id, screen))
    const props = { key: route, gameId: g, level: +l }
    if (!open || screen === 'level') return <LevelScreen {...props} />
    if (screen === 'learn') return <LearnScreen {...props} />
    if (screen === 'practice') return <LessonScreen {...props} />
    return <PlayScreen {...props} />
  }

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="icon-mark small" aria-hidden="true"><Icon name="ear" size={20} /></span>
          <span className="brand-name">{en.appName}</span>
        </a>
        <nav className="tabs" aria-label="Main">
          {TABS.map(([path, icon, label]) => (
            <a key={path} href={`#${path}`} className="tab" aria-current={route === path ? 'page' : undefined}>
              <Icon name={icon} /> <span>{label}</span>
            </a>
          ))}
        </nav>
        <Stats />
      </header>
      <main className="content">
        {route === '/games' ? <GamesScreen /> : route === '/profile' ? <ProfileScreen /> : <PathScreen />}
      </main>
    </div>
  )
}

function Stats() {
  const p = useProgress()
  const today = dayKey()
  const streak = currentStreak(p, today)
  const goal = Math.min(1, todayXp(p, today) / p.dailyGoal)
  return (
    <div className="stats">
      <span className={`stat streak ${streak ? 'on' : ''}`} title={`${streak} ${en.stats.streak}`}>
        <Icon name="flame" size={20} /> {streak}
      </span>
      <span className="stat xp" title={en.stats.xp}><Icon name="bolt" size={20} /> {p.xp}</span>
      <button className="goal-ring" onClick={() => go('/profile')}
        aria-label={`${en.stats.goal}: ${todayXp(p, today)} / ${p.dailyGoal} ${en.stats.xp}`}>
        <svg viewBox="0 0 36 36" width="32" height="32" aria-hidden="true">
          <circle cx="18" cy="18" r="15" className="ring-bg" />
          <circle cx="18" cy="18" r="15" className="ring-fg" strokeDasharray={`${goal * 94.25} 94.25`} />
        </svg>
      </button>
    </div>
  )
}
