import type { Page } from '@playwright/test'

/** Start the app with saved progress (skips the welcome page unless asked) */
export async function open(page: Page, hash: string, progress?: object, welcomed = true) {
  await page.goto('./')
  await page.evaluate(([p, w]) => {
    localStorage.clear()
    if (w) localStorage.setItem('etwf.welcomed', '1')
    if (p) localStorage.setItem('etwf.progress.v1', JSON.stringify(p))
  }, [progress ?? null, welcomed] as const)
  await page.goto(`./#${hash}`)
  await page.reload()
}

export const learned = (ids: string[], extra: object = {}) => ({
  xp: 1, levels: Object.fromEntries(ids.map((id) => [id, { best: 0, done: false, plays: 0, learned: true, ...extra }])),
})

/** Answer the current calm-round question: try options until one is right, then continue */
export async function answerAndContinue(page: Page) {
  // a fresh page load cannot play sound until the first tap (iOS rule): tap like a user would
  if (await page.locator('.tap-overlay').count()) await page.locator('.tap-overlay').click()
  const opts = page.locator('.answer')
  const n = await opts.count()
  for (let k = 0; k < n; k++) {
    if (await page.locator('.feedback').count()) break
    await opts.nth(k).click()
  }
  await page.locator('.feedback .btn-dark').click()
  // the next question crossfades in a frame later: wait for the old feedback to leave
  await page.locator('.feedback').waitFor({ state: 'detached' })
}
