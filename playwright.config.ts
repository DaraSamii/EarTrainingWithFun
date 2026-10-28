import { defineConfig, devices } from '@playwright/test'

// Real-browser tests against the production build. CI uses the Chrome preinstalled on GitHub runners;
// locally set PW_EXECUTABLE to any Chromium-based browser (e.g. /usr/bin/brave-browser).
export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173/EarTrainingWithFun/',
    trace: 'retain-on-failure',
    channel: process.env.PW_EXECUTABLE ? undefined : 'chrome',
    launchOptions: {
      executablePath: process.env.PW_EXECUTABLE || undefined,
      args: ['--autoplay-policy=no-user-gesture-required'],
    },
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 860 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' }, grep: /@phone/ },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/EarTrainingWithFun/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
