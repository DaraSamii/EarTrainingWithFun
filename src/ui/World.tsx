import type { GameId } from '../games/catalog'

/** Paper-cut scenery for each game's world (ADR-015). Purely decorative. */
export function World({ game }: { game: GameId }) {
  return game === 'degrees' ? (
    <div className="world world-garden" aria-hidden="true">
      <span className="w-sun" />
      <span className="w-cloud c1" />
      <span className="w-cloud c2" />
      <span className="w-hill h1" />
      <span className="w-hill h2" />
      <span className="w-tri t1" />
      <span className="w-tri t2" />
      <span className="w-flower f1" />
      <span className="w-flower f2" />
    </div>
  ) : (
    <div className="world world-space" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => <span key={i} className={`w-star s${i}`} />)}
      <span className="w-planet p1" />
      <span className="w-planet p2" />
      <span className="w-moon" />
    </div>
  )
}
