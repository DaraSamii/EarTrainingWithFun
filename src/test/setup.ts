// Browser APIs jsdom lacks, stubbed for component tests (audio is mocked per test file)
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  if (typeof window === 'undefined') return
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
  location.hash = ''
})

if (typeof window !== 'undefined') {
  window.matchMedia ??= ((q: string) => ({
    matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
  Element.prototype.scrollIntoView ??= function () {}
  window.requestAnimationFrame ??= ((cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as unknown as number)
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} unobserve() {} })
}
