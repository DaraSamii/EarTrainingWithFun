import { en } from '../i18n/en'

export default function App() {
  return (
    <main className="hero">
      <div className="shapes" aria-hidden="true">
        <span className="shape pentagon" />
        <span className="shape semicircle" />
        <span className="shape triangle" />
        <span className="shape circle" />
      </div>
      <div className="hero-content">
        <div className="icon-mark" aria-hidden="true">♪</div>
        <h1>{en.hero.title}</h1>
        <p>{en.hero.subtitle}</p>
        <button className="btn-primary" disabled>
          {en.hero.cta} <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  )
}
