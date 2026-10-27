import { go } from '../app/router'
import { Icon } from './Icon'
import { en } from '../i18n/en'

/** Every full-screen page can always reach Home and its parent (user feedback 0.3.0) */
export function ExitBar({ back, onWorld = false }: { back?: string; onWorld?: boolean }) {
  const cls = `icon-btn ${onWorld ? 'on-world' : ''}`
  return (
    <div className="exit-bar">
      <button className={cls} aria-label={en.nav.home} title={en.nav.home} onClick={() => go('/')}><Icon name="home" /></button>
      {back && <button className={cls} aria-label={en.nav.back} title={en.nav.back} onClick={() => go(back)}><Icon name="back" /></button>}
    </div>
  )
}
