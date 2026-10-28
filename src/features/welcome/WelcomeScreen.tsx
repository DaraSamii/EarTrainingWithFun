import { useEffect, useRef } from 'react'
import { ALL_IDS, COURSES, GAMES, nextActivity } from '../../games/catalog'
import { getProgress } from '../../progress/store'
import { BOX_DAYS } from '../../progress/srs'
import { go } from '../../app/router'
import { useKeys } from '../../app/keys'
import { Icon, type IconName } from '../../ui/Icon'
import { Pip, Bubble } from '../../ui/Pip'
import { World } from '../../ui/World'
import { CourseIcon } from '../../ui/GameIcon'
import { Rich } from '../../ui/Rich'
import { en } from '../../i18n/en'

import { WELCOMED } from '../../app/settings'

/** Reveal sections as they scroll into view (adds `.in`) */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal') ?? []
    if (typeof IntersectionObserver === 'undefined') { els.forEach((e) => e.classList.add('in')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.15 })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
  return ref
}

/** What the app can do, and one button into the first game (user feedback 0.8.0) */
export function WelcomeScreen() {
  const ref = useReveal()
  const start = () => {
    try { localStorage.setItem(WELCOMED, '1') } catch { /* private mode */ }
    go(nextActivity(getProgress(), '/'))
  }
  useKeys({ next: start })
  const W = en.welcome
  const steps: [IconName, string, string][] = [['book', W.learn, W.learnText], ['target', W.practice, W.practiceText], ['gamepad', W.play, W.playText]]
  const facts = [[COURSES.length, W.courses], [Object.keys(GAMES).length, W.games], [ALL_IDS.length, W.levels], [12, W.instruments]] as const

  return (
    <div className="welcome" ref={ref}>
      <section className="w-hero">
        <World world="garden" />
        <div className="w-hero-inner reveal in">
          <div className="pip-stage"><Pip mood="happy" size={150} /><Bubble side="bottom"><p><Rich text={W.pip} /></p></Bubble></div>
          <h1>{W.title}</h1>
          <p className="lede"><Rich text={W.lede} /></p>
          <div className="actions">
            <button className="btn-primary big" autoFocus onClick={start}>{W.start} <Icon name="arrow" size={22} /></button>
            <button className="btn-ghost" onClick={() => { try { localStorage.setItem(WELCOMED, '1') } catch { /* */ } go('/courses') }}>{W.explore}</button>
          </div>
        </div>
      </section>

      <section className="w-facts reveal">
        {facts.map(([n, label], i) => <div key={label} className="card w-fact" style={{ transitionDelay: `${i * 80}ms` }}><strong>{n}</strong><span>{label}</span></div>)}
      </section>

      <section className="w-section reveal">
        <h2>{W.howTitle}</h2>
        <div className="w-steps">
          {steps.map(([icon, t, d], i) => (
            <div key={t} className="card w-step" style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="w-step-num">{i + 1}</span><Icon name={icon} size={34} /><h3>{t}</h3><p><Rich text={d} /></p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-section reveal">
        <h2>{W.coursesTitle}</h2>
        <div className="w-courses">
          {COURSES.map((c, i) => (
            <button key={c.id} className={`card w-course c-${c.color}`} style={{ transitionDelay: `${i * 60}ms` }} onClick={() => go(`/course/${c.id}`)}>
              <div className="w-course-art"><World world={GAMES[c.games[0]].world} /><span className="course-glyph"><CourseIcon id={c.id} size={40} /></span></div>
              <h3>{c.title}</h3><p>{c.blurb}</p>
              <small>{W.arcades[GAMES[c.games[0]].arcade]}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="w-section reveal">
        <h2>{W.memoryTitle}</h2>
        <p className="lede"><Rich text={W.memoryText} /></p>
        <ol className="w-timeline">{BOX_DAYS.slice(1).map((d, i) => <li key={d} style={{ transitionDelay: `${i * 90}ms` }}><strong>{d}</strong><span>{d === 1 ? W.day : W.days}</span></li>)}</ol>
      </section>

      <section className="w-section w-extras reveal">
        <div className="card"><Icon name="book" size={30} /><h3>{W.notebookTitle}</h3><p><Rich text={W.notebookText} /></p></div>
        <div className="card"><Icon name="arrow" size={30} /><h3>{W.keysTitle}</h3><p>{W.keysText}</p></div>
        <div className="card"><Icon name="volume" size={30} /><h3>{W.soundTitle}</h3><p><Rich text={W.soundText} /></p></div>
      </section>

      <section className="w-final reveal">
        <Pip mood="talk" size={110} />
        <h2>{W.finalTitle}</h2>
        <button className="btn-primary big" onClick={start}>{W.start} <Icon name="arrow" size={22} /></button>
      </section>
    </div>
  )
}
