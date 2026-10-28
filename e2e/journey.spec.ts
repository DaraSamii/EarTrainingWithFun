import { expect, test } from '@playwright/test'
import { answerAndContinue, learned, open } from './helpers'

test('welcome → Let\'s start → learn with the keyboard → practice → results', async ({ page }) => {
  await open(page, '/', undefined, false)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Train your ears')
  await page.getByRole('button', { name: "Let's start" }).first().click()
  await expect(page).toHaveURL(/#\/level\/pitch\/0/)
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#\/learn\/pitch\/0/)
  // lesson cards: wait for each card before pressing again (keys during a page transition reach the old page)
  for (let k = 1; k <= 7; k++) {
    await expect(page.getByText(`${k} / 7`)).toBeVisible()
    await page.keyboard.press('ArrowRight')
  }
  await page.getByRole('button', { name: 'Play all' }).click()
  await page.getByRole('button', { name: /^Next/ }).click()
  // guided tries: try options until right, then Next
  for (let t = 0; t < 3; t++) {
    await expect(page.getByText(`Try ${t + 1} of 3`)).toBeVisible()
    for (const label of ['Higher', 'Lower']) {
      if (await page.locator('.answer.is-correct').count()) break
      await page.locator('.answer', { hasText: label }).click()
    }
    await page.getByRole('button', { name: /^Next/ }).last().click()
  }
  await page.getByRole('button', { name: 'Go to practice' }).click()
  await expect(page).toHaveURL(/#\/practice\/pitch\/0/)
  for (let k = 0; k < 14 && !(await page.locator('.results').count()); k++) await answerAndContinue(page)
  await expect(page.locator('.results h1')).toBeVisible()
  await expect(page.locator('.score-pill')).toContainText('%')
})

test('an arcade round (Peak Climber) runs to its results without lives', async ({ page }) => {
  await open(page, '/play/pitch/0', learned(['pitch:0'], { practiced: true }))
  await expect(page.locator('.how-to li').first()).toBeVisible()
  await page.keyboard.press('Enter')
  // answer every question: 1 then 2 always lands the right one, first or second try
  await expect(async () => {
    await page.keyboard.press('1')
    await page.keyboard.press('2')
    await expect(page.locator('.results')).toBeVisible({ timeout: 400 })
  }).toPass({ timeout: 110_000, intervals: [300] })
  await expect(page.locator('.results .stat-grid')).toContainText('Score')
})

test('every themed arcade starts and shows its scene', async ({ page }) => {
  const scenes: [string, string][] = [['pitch', '.climb'], ['contour', '.river'], ['chords', '.lab'], ['rhythm', '.track'], ['timbre', '.pond'], ['degrees', '.breaker'], ['intervals', '.blaster'], ['notes', '.drops']]
  for (const [g, sel] of scenes) {
    await open(page, `/play/${g}/0`, learned([`${g}:0`], { practiced: true }))
    await expect(page.getByRole('button', { name: /Ready/ })).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator(sel)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page).toHaveURL(new RegExp(`#/level/${g}/0`))
  }
})

test('review: due items come back and pass', async ({ page }) => {
  await open(page, '/review/due', { ...learned(['intervals:0']), memory: { 'intervals:P5': { box: 1, due: '2020-01-01', seen: 1, lapses: 0, lvl: 0 }, 'intervals:P8': { box: 2, due: '2020-01-01', seen: 2, lapses: 0, lvl: 0 } } })
  for (let k = 0; k < 10 && !(await page.locator('.results').count()); k++) await answerAndContinue(page)
  await expect(page.locator('.results')).toBeVisible()
  const mem = await page.evaluate(() => JSON.parse(localStorage.getItem('etwf.progress.v1')!).memory)
  expect(mem['intervals:P5'].seen).toBeGreaterThan(1)
})

test('notebook search narrows the pages', async ({ page }) => {
  await open(page, '/notebook')
  await expect(page.locator('.nb-page')).toHaveCount(25)
  await page.getByRole('searchbox').fill('tritone')
  const n = await page.locator('.nb-page').count()
  expect(n).toBeGreaterThan(0)
  expect(n).toBeLessThan(25)
})
