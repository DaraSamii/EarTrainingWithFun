import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { learned, open } from './helpers'

const PAGES = ['/', '/courses', '/games', '/notebook', '/profile', '/welcome', '/level/pitch/0', '/learn/pitch/0']

test.describe('accessibility (axe)', () => {
  for (const p of PAGES) {
    test(`no critical or serious violations on ${p}`, async ({ page }) => {
      await open(page, p, learned(['pitch:0']))
      await page.waitForTimeout(600) // let entrance animations settle
      const r = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze()
      const bad = r.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
      expect(bad.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([])
    })
  }
})

test('@phone pages never scroll sideways', async ({ page }) => {
  for (const p of ['/', '/courses', '/games', '/notebook', '/profile', '/welcome', '/level/pitch/0']) {
    await open(page, p)
    await page.waitForTimeout(300)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, p).toBeLessThanOrEqual(1)
  }
})

test('with reduced motion, things still appear and disappear (instantly)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, '/play/pitch/0', learned(['pitch:0'], { practiced: true }))
  await page.keyboard.press('Enter')
  await expect(page.locator('.overlay')).toHaveCount(0)
  await page.getByRole('button', { name: 'How to play' }).click()
  await expect(page.locator('.help-pop')).toBeVisible()
  await page.getByRole('button', { name: 'How to play' }).click()
  await expect(page.locator('.help-pop')).toHaveCount(0)
})

test('exits animate: the help panel leaves with an exit animation, then unmounts', async ({ page }) => {
  await open(page, '/play/pitch/0', learned(['pitch:0'], { practiced: true }))
  await page.keyboard.press('Enter')
  const help = page.getByRole('button', { name: 'How to play' })
  await help.click()
  await expect(page.locator('.help-pop.p-in')).toBeVisible()
  await help.click()
  await expect(page.locator('.help-pop.p-out')).toHaveCount(1)
  await expect(page.locator('.help-pop')).toHaveCount(0)
})

test('overlays are on top: tapping "Tap to listen" hits the overlay, not the answers under it', async ({ page }) => {
  await open(page, '/practice/pitch/0', learned(['pitch:0']))
  const overlay = page.locator('.tap-overlay')
  await expect(overlay).toBeVisible()
  const box = (await overlay.boundingBox())!
  const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('.tap-overlay') !== null, [box.x + box.width / 2, box.y + box.height * 0.75] as const)
  expect(hit).toBe(true)
  await overlay.click()
  await expect(overlay).toHaveCount(0)
})
