import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base must match the GitHub Pages repo path (ADR-008)
export default defineConfig({
  base: '/EarTrainingWithFun/',
  plugins: [react()],
  test: {
    // logic tests run in node; *.dom.test.tsx files opt into jsdom with a `@vitest-environment jsdom` comment
    setupFiles: ['src/test/env.ts', 'src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
