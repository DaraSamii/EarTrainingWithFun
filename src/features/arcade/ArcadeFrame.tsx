import { useState } from 'react'
import type { Game } from '../../games/catalog'
import { play } from '../../audio/engine'
import { World } from '../../ui/World'
import { OptionFace } from '../../ui/OptionFace'
import { Staff } from '../../ui/Staff'
import { Countdown, Hud, Popups, StartOverlay } from './shared'
import type { Rounds } from './useRounds'
import { en } from '../../i18n/en'

/** Everything around a themed scene: world, HUD, answer buttons, banners, start overlay and countdown */
export function ArcadeFrame({ r, game, level, scene, zones = true, zoneClass = '' }: {
  r: Rounds; game: Game; level: number; scene: React.ReactNode; zones?: boolean; zoneClass?: string
}) {
  const { g } = r
  const [help, setHelp] = useState(false)
  const helpLines = en.arcadeHelp[game.arcade]
  return (
    <div className={`arcade world-bg-${game.world} arcade-${game.arcade}`}>
      <World world={game.world} />
      <Hud total={r.total} results={g.results} score={g.score} combo={g.combo} back={r.back}
        onReplay={g.q?.prompt.length ? () => play(g.q!.prompt) : undefined} onHelp={() => setHelp((h) => !h)} />
      {help && <div className="help-pop" role="note"><ul>{helpLines.map((h) => <li key={h}>{h}</li>)}</ul></div>}

      <div className="stage themed">
        {scene}
        {g.q?.visual && g.phase !== 'intro' && <div className="stage-visual" key={g.n}><Staff v={g.q.visual} width={200} /></div>}
        <Popups items={g.popups} />
        {g.banner && <div className="banner" role="status">{g.banner}</div>}
      </div>

      {zones && (
        <div className={`zones ${zoneClass}`} data-count={r.options.length}>
          {r.options.map((o, k) => (
            <button key={`${g.n}-${o.id}`} style={{ '--i': k } as React.CSSProperties}
              className={`zone ${g.phase === 'miss' && k === g.ans ? 'reveal' : ''} ${g.wrong === k ? 'is-wrong' : ''} ${g.phase === 'hit' && k === g.ans ? 'is-hit' : ''}`}
              onPointerDown={(e) => { e.preventDefault(); r.answer(k) }} onClick={(e) => e.detail === 0 && r.answer(k)}>
              <kbd aria-hidden="true">{k + 1}</kbd>
              <OptionFace o={o} compact={r.options.length > 4} />
            </button>
          ))}
        </div>
      )}

      {g.phase === 'intro' && (
        <StartOverlay title={`${game.title} · ${en.path.level} ${level + 1}`} text={game.instruction} help={helpLines} onStart={r.start} />
      )}
      {g.phase === 'count' && <Countdown onDone={r.ask} />}
    </div>
  )
}
