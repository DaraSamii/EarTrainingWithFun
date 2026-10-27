/// <reference types="node" />
import { readFileSync, readdirSync } from 'node:fs'
import { expect, test } from 'vitest'

// 0.7.1 regression: a second top-level `.bubble { … }` (potion bubbles in screens.css) broke every Pip speech bubble.
test("Pip's speech bubble class is defined in exactly one place", () => {
  const dir = new URL('.', import.meta.url).pathname
  const defs = readdirSync(dir).filter((f) => f.endsWith('.css'))
    .flatMap((f) => [...readFileSync(dir + f, 'utf8').matchAll(/^\.bubble \{/gm)].map(() => f))
  expect(defs).toEqual(['world.css'])
})
