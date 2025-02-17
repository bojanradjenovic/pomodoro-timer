import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PomodoroTimer from './PomodoroTimer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PomodoroTimer />
  </StrictMode>,
)
