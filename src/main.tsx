import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'
import './styles/lesson.css'
import './styles/game.css'
import './styles/world.css'
import App from './app/App.tsx'
import { applyTheme, savedTheme } from './app/theme'
import { unlock } from './audio/engine'

applyTheme(savedTheme())
// iOS/Safari only allow starting audio inside a user gesture
for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, unlock, { once: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
