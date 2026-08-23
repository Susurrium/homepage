import { defineConfig, devices } from '@playwright/test';

const configuredBase = process.env.BASE_PATH ?? '/homepage';
const basePath = `/${configuredBase.replace(/^\/+|\/+$/g, '')}${configuredBase === '/' ? '' : '/'}`;
const localOrigin = process.env.PLAYWRIGHT_ORIGIN ?? 'http://localhost:4321';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? new URL(basePath, localOrigin).toString();

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run preview -- --host localhost --port 4321',
        env: {
          ASTRO_PREVIEW_BACKGROUND: '0'
        },
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
      },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
