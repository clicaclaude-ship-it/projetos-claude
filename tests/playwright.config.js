// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './specs',
  fullyParallel: false,
  retries: 1,
  timeout: 30000,
  expect: { timeout: 8000 },
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://clicaai.ia.br',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    // Emula usuário brasileiro
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
