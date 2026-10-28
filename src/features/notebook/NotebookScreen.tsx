import { useState } from 'react'
import { COURSES, GAMES, type GameId } from '../../games/catalog'
import { CourseIcon, GameIcon } from '../../ui/GameIcon'
import { Rich } from '../../ui/Rich'
import { RatioWaves } from '../../ui/RatioWaves'
import { Icon } from '../../ui/Icon'
import { en } from '../../i18n/en'

/** Everything the app teaches, as one notebook to reread (user feedback 0.8.0) */
export function NotebookScreen() {
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const textOf = (g: GameId) => {
    const gu = en.guides[g]
    const sc = en.science[g]
    return [GAMES[g].title, GAMES[g].blurb, gu?.what, ...(gu?.listen ?? []), gu?.watch, gu?.real, sc?.why, sc?.math, ...GAMES[g].levels.map((l) => `${l.title} ${l.skill} ${l.concept ?? ''}`)]
      .join(' ').toLowerCase()
  }
  const show = (g: GameId) => !needle || textOf(g).includes(needle)
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="notebook">
      <aside className="nb-toc" aria-label={en.notebook.contents}>
        <h2>{en.notebook.contents}</h2>
        <ol>
          {COURSES.map((c) => (
            <li key={c.id}>
              <button className={`c-${c.color}`} onClick={() => jump(`nb-${c.id}`)}><span className="course-dot small"><CourseIcon id={c.id} size={22} /></span>{c.title}</button>
              <ul>{c.games.filter(show).map((g) => <li key={g}><button onClick={() => jump(`nb-${g}`)}>{GAMES[g].title}</button></li>)}</ul>
            </li>
          ))}
        </ol>
      </aside>

      <main className="nb-pages">
        <header className="nb-head">
          <h1>{en.notebook.title}</h1>
          <p className="lede">{en.notebook.blurb}</p>
          <label className="nb-search">
            <Icon name="target" size={18} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={en.notebook.search} aria-label={en.notebook.search} />
          </label>
        </header>

        {COURSES.map((c) => {
          const games = c.games.filter(show)
          if (!games.length) return null
          return (
            <section key={c.id} id={`nb-${c.id}`} className={`nb-course c-${c.color}`}>
              <h2><span className="course-dot"><CourseIcon id={c.id} size={30} /></span>{c.title}<small>{c.blurb}</small></h2>
              {games.map((g) => {
                const game = GAMES[g]
                const gu = en.guides[g]
                const sc = en.science[g]
                return (
                  <article key={g} id={`nb-${g}`} className="nb-page">
                    <h3><span className="nb-icon"><GameIcon id={g} size={28} /></span>{game.title}</h3>
                    {gu && <section><h4>{en.learn.cards.what}</h4><p><Rich text={gu.what} /></p></section>}
                    {gu && <section><h4>{en.learn.cards.listen}</h4><ul>{gu.listen.map((t) => <li key={t}><Rich text={t} /></li>)}</ul></section>}
                    {sc && <section className="nb-science"><h4>{en.learn.cards.why}</h4><p><Rich text={sc.why} /></p></section>}
                    {sc && <section className="nb-science"><h4>{en.learn.cards.math}</h4><p className="nb-math">{sc.math}</p>{sc.ratio && <RatioWaves ratio={sc.ratio} />}</section>}
                    {gu && <section><h4>{en.learn.cards.watch}</h4><p><Rich text={gu.watch} /></p></section>}
                    {gu && <section><h4>{en.learn.cards.real}</h4><p><Rich text={gu.real} /></p></section>}
                    <section>
                      <h4>{en.notebook.levels}</h4>
                      <ol className="nb-levels">
                        {game.levels.map((l, i) => (
                          <li key={i}><strong>{l.title}</strong> <span className="nb-skill">{l.skill}</span>{l.concept && <p><Rich text={l.concept} /></p>}</li>
                        ))}
                      </ol>
                    </section>
                  </article>
                )
              })}
            </section>
          )
        })}
        {!COURSES.some((c) => c.games.some(show)) && <p className="lede">{en.notebook.none}</p>}
      </main>
    </div>
  )
}
