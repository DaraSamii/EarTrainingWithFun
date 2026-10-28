// @vitest-environment jsdom
import './audio.mock'
import { audio } from './audio.mock'
import { beforeEach, describe, expect, test } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import App from '../app/App'
import { LearnScreen } from '../features/learn/LearnScreen'
import { LessonScreen } from '../features/lesson/LessonScreen'
import { ReviewScreen } from '../features/review/ReviewScreen'
import { ProfileScreen } from '../features/profile/ProfileScreen'
import { getProgress, setProgress } from '../progress/store'
import { initialProgress, level, type Progress } from '../progress/progress'
import type { Step } from '../music/theory'

const go = async (hash: string) => act(async () => {
  location.hash = hash
  window.dispatchEvent(new HashChangeEvent('hashchange'))
})
const key = (k: string) => act(() => { fireEvent.keyDown(window, { key: k }) })
const learned = (id: string, extra = {}): Progress => ({ ...initialProgress, levels: { [id]: { best: 0, done: false, plays: 0, learned: true, ...extra } } })

/** Higher or Lower: the answer is in the last prompt the app played (second note above the first?) */
function pitchAnswer(): 'up' | 'down' {
  const steps = [...audio.play.mock.calls].reverse().map((c) => c[0] as Step[]).find((s) => s.length === 3 && s[0].notes.length && s[2].notes.length)!
  return steps[2].notes[0] > steps[0].notes[0] ? 'up' : 'down'
}
const answers = () => [...document.querySelectorAll<HTMLButtonElement>('.answer')]
const answerByLabel = (label: string) => answers().find((b) => b.textContent!.includes(label))!

beforeEach(() => {
  setProgress(initialProgress)
  audio.play.mockClear()
})

describe('app routing', () => {
  test('a first visit shows the Welcome page; Let\'s start opens the first level', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Train your ears/)
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: /Let's start/ })[0]) })
    expect(location.hash).toBe('#/level/pitch/0?from=%2F')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Big steps')
  })

  test('after the welcome, Home shows the Journey with stage tabs; tabs open each page', async () => {
    localStorage.setItem('etwf.welcomed', '1')
    render(<App />)
    expect(screen.getByText('Your Journey')).toBeTruthy()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    await go('#/courses')
    expect(screen.getAllByText('Open course').length).toBe(8)
    await go('#/notebook')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Notebook')
    expect(document.querySelectorAll('.nb-page').length).toBe(25)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'octave' } })
    expect(document.querySelectorAll('.nb-page').length).toBeLessThan(25)
    await go('#/games')
    expect(screen.getByText('Games', { selector: 'h1' })).toBeTruthy()
  })

  test('a locked step URL shows the level gate instead (no jumping into games)', async () => {
    render(<App />)
    await go('#/play/chords/3')
    expect(screen.getByText('Finish the levels before this one to unlock it.')).toBeTruthy()
    await go('#/play/pitch/0')
    expect(screen.getAllByText('Locked').length).toBe(2)
  })
})

describe('Learn', () => {
  test('lesson cards → demos → three guided tries → learned', async () => {
    location.hash = '#/learn/pitch/0'
    render(<LearnScreen gameId="pitch" level={0} />)
    // 7 cards on a first level: idea, what, listen, why, math, watch out, real music
    expect(screen.getByText('1 / 7')).toBeTruthy()
    key('ArrowRight')
    expect(screen.getByText('2 / 7')).toBeTruthy()
    key('ArrowLeft')
    expect(screen.getByText('1 / 7')).toBeTruthy()
    for (let k = 0; k < 7; k++) key('ArrowRight')
    // demos: Next stays disabled until every sound was heard
    const next = screen.getByRole('button', { name: /Next/ })
    expect((next as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: /Play all/ }))
    expect((next as HTMLButtonElement).disabled).toBe(false)
    fireEvent.click(next)
    for (let t = 0; t < 3; t++) {
      expect(screen.getByText(`Try ${t + 1} of 3`)).toBeTruthy()
      fireEvent.click(answerByLabel(pitchAnswer() === 'up' ? 'Higher' : 'Lower'))
      fireEvent.click(screen.getAllByRole('button', { name: /Next/ }).at(-1)!)
    }
    expect(screen.getByRole('button', { name: /Go to practice/ })).toBeTruthy()
    expect(level(getProgress(), 'pitch:0').learned).toBe(true)
  })
})

describe('Practice and results', () => {
  async function practice(correctly: boolean) {
    setProgress(learned('pitch:0'))
    location.hash = '#/practice/pitch/0'
    render(<LessonScreen gameId="pitch" level={0} />)
    for (let k = 0; k < 20 && !document.querySelector('.results'); k++) {
      const a = pitchAnswer()
      const pick = correctly ? a : a === 'up' ? 'down' : 'up'
      fireEvent.click(answerByLabel(pick === 'up' ? 'Higher' : 'Lower'))
      await act(async () => { fireEvent.click(within(document.querySelector('.feedback') as HTMLElement).getByRole('button', { name: /Continue/ })) })
    }
  }

  test('a perfect round passes, unlocks Play, and → goes to Play', async () => {
    await practice(true)
    expect(screen.getByText('Perfect!')).toBeTruthy()
    expect(screen.getByText(/100% · passed \(80%\)/)).toBeTruthy()
    expect(level(getProgress(), 'pitch:0').practiced).toBe(true)
    key('ArrowRight')
    expect(location.hash).toBe('#/play/pitch/0')
  })

  test('a failed round asks to practice again and keeps Play locked; every miss is re-asked', async () => {
    await practice(false)
    expect(screen.getByText('Keep at it')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Practice again/ })).toBeTruthy()
    expect(level(getProgress(), 'pitch:0').practiced).toBeFalsy()
    // missed items fed the memory model so they come back tomorrow
    expect(getProgress().memory['pitch:L0'].lapses).toBe(1)
  })
})

describe('Review', () => {
  test('a due review re-asks items and moves them to the next box', async () => {
    setProgress({ ...learned('pitch:0'), memory: { 'pitch:L0': { box: 1, due: '2020-01-01', seen: 1, lapses: 0, lvl: 0 } } })
    render(<ReviewScreen scope="due" />)
    for (let k = 0; k < 10 && !document.querySelector('.results'); k++) {
      fireEvent.click(answerByLabel(pitchAnswer() === 'up' ? 'Higher' : 'Lower'))
      await act(async () => { fireEvent.click(within(document.querySelector('.feedback') as HTMLElement).getByRole('button', { name: /Continue/ })) })
    }
    expect(screen.getByText('Perfect!')).toBeTruthy()
    expect(getProgress().memory['pitch:L0'].box).toBe(2)
  })

  test('with nothing learned yet, the review explains itself instead of starting', () => {
    render(<ReviewScreen scope="due" />)
    expect(screen.getByText(/Nothing to review yet/)).toBeTruthy()
  })
})

describe('Profile', () => {
  test('the passing score can be changed', () => {
    render(<ProfileScreen />)
    const r = screen.getByRole('radio', { name: '60%' })
    fireEvent.click(r)
    expect(r.getAttribute('aria-checked')).toBe('true')
    expect(localStorage.getItem('etwf.pass')).toBe('0.6')
  })
})

describe('keyboard and chrome', () => {
  test('on a level gate, → starts the next step and Esc goes back where you came from', async () => {
    render(<App />)
    await go('#/level/pitch/0?from=%2Fcourses')
    key('ArrowRight')
    expect(location.hash).toBe('#/learn/pitch/0')
    await go('#/level/pitch/0?from=%2Fcourses')
    key('Escape')
    expect(location.hash).toBe('#/courses')
  })

  test('the theme toggle switches light and dark', () => {
    localStorage.setItem('etwf.welcomed', '1')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }))
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  test('stat cards open their detail panel and close it again', () => {
    localStorage.setItem('etwf.welcomed', '1')
    render(<App />)
    const streak = screen.getByRole('button', { name: /day streak/ })
    fireEvent.click(streak)
    expect(streak.getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelector('.stat-panel.open .week')).not.toBeNull()
    fireEvent.click(streak)
    expect(document.querySelector('.stat-panel.open')).toBeNull()
    // content stays mounted while the panel animates closed
    expect(document.querySelector('.stat-panel .week')).not.toBeNull()
  })
})
