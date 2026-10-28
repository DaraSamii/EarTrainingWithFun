// @vitest-environment jsdom
import { describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Rich } from './Rich'
import { Presence } from './Presence'
import { GameIcon, CourseIcon } from './GameIcon'
import { Staff } from './Staff'
import { RatioWaves } from './RatioWaves'
import { StageTabs } from '../features/path/StageTabs'
import { COURSES, GAMES, JOURNEY, type GameId } from '../games/catalog'

describe('Rich (textured words)', () => {
  test('acts out sound words letter by letter but keeps the plain word for screen readers', () => {
    const { container } = render(<p><Rich text="The second note climbs higher, then gets softer." /></p>)
    const [climbs, up] = container.querySelectorAll('.fx-up')
    expect(climbs.querySelector('.sr-only')!.textContent).toBe('climbs')
    expect(up.querySelector('.sr-only')!.textContent).toBe('higher')
    expect(up.querySelectorAll('.fx-l[aria-hidden="true"]')).toHaveLength(6)
    expect(container.querySelector('.fx-shrink .sr-only')!.textContent).toBe('softer')
    expect(container.textContent).toContain('The second note')
  })

  test('leaves ordinary text alone and matches case-insensitively', () => {
    const { container } = render(<p><Rich text="Bright chords, nothing else." /></p>)
    expect(container.querySelectorAll('.fx')).toHaveLength(1)
    expect(container.querySelector('.fx-bright')!.textContent).toBe('Bright')
    const plain = render(<p><Rich text="Name the interval." /></p>)
    expect(plain.container.querySelector('.fx')).toBeNull()
  })
})

describe('Presence (exit animations)', () => {
  test('keeps content while it animates out, then unmounts', () => {
    const { rerender, container } = render(<Presence show className="x"><span>hello</span></Presence>)
    expect(container.querySelector('.p-in')).not.toBeNull()
    rerender(<Presence show={false} className="x"><span>changed</span></Presence>)
    // still shows the last content while leaving
    expect(container.querySelector('.p-out')!.textContent).toBe('hello')
    fireEvent.animationEnd(container.querySelector('.p-out')!)
    expect(container.querySelector('.presence')).toBeNull()
  })

  test('unmounts immediately when the user prefers reduced motion', () => {
    const mm = vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
    const { rerender, container } = render(<Presence show><span>hi</span></Presence>)
    rerender(<Presence show={false}><span>hi</span></Presence>)
    expect(container.querySelector('.presence')).toBeNull()
    mm.mockRestore()
  })
})

describe('icons, staff and waves', () => {
  test('every game and course has an icon', () => {
    for (const g of Object.keys(GAMES) as GameId[]) {
      const { container, unmount } = render(<GameIcon id={g} />)
      expect(container.querySelector('svg, .icon-text'), g).not.toBeNull()
      unmount()
    }
    for (const c of COURSES) {
      const { container, unmount } = render(<CourseIcon id={c.id} />)
      expect(container.querySelector('svg, .icon-text'), c.id).not.toBeNull()
      unmount()
    }
  })

  test('the staff draws ledger lines and key signatures', () => {
    const middleC = render(<Staff v={{ kind: 'staff', clef: 'treble', notes: [60] }} />)
    expect(middleC.container.querySelectorAll('line.ledger')).toHaveLength(1)
    expect(middleC.container.querySelectorAll('ellipse')).toHaveLength(1)
    const dMajor = render(<Staff v={{ kind: 'staff', clef: 'treble', notes: [], keySig: 2 }} />)
    expect([...dMajor.container.querySelectorAll('.acc')].map((a) => a.textContent)).toEqual(['♯', '♯'])
    const bFlat = render(<Staff v={{ kind: 'staff', clef: 'treble', notes: [], keySig: -2 }} />)
    expect(bFlat.container.querySelectorAll('.acc')).toHaveLength(2)
  })

  test('ratio waves draw one wave per number and label the ratio', () => {
    render(<RatioWaves ratio={[3, 2]} />)
    expect(screen.getByText('3 : 2')).toBeTruthy()
    expect(document.querySelectorAll('path.wave')).toHaveLength(2)
  })
})

describe('StageTabs', () => {
  test('shows three stages, reports clicks and moves with arrow keys', () => {
    const onChange = vi.fn()
    render(<StageTabs units={JOURNEY} stage={0} onChange={onChange} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((t) => t.querySelector('strong')!.textContent)).toEqual(['Beginner', 'Intermediate', 'Advanced'])
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    act(() => { fireEvent.click(tabs[2]) })
    expect(onChange).toHaveBeenLastCalledWith(2)
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(1)
  })
})
