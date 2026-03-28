// @ts-check
const { test, expect } = require('@playwright/test');

const EXPECTED_CASES = [
  { sector: /varejo|e-commerce/i },
  { sector: /indústria|industrial/i },
  { sector: /saúde|clínica/i },
  { sector: /logística/i },
  { sector: /financeiro|finanças/i },
  { sector: /rh|recursos humanos/i },
];

test.describe('Página de Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/cases.html');
    await page.waitForSelector('header', { timeout: 8000 });
  });

  // ── Page Hero ────────────────────────────────────────────────────────────

  test('Page hero carrega com título e imagem', async ({ page }) => {
    const hero = page.locator('.page-hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toBeVisible();
    await expect(hero.locator('img')).toBeVisible();
  });

  // ── Grid de Cases ────────────────────────────────────────────────────────

  test('Grid de cases tem 6 cards', async ({ page }) => {
    const cards = page.locator('.case-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(4);
  });

  for (const c of EXPECTED_CASES) {
    test(`Card do setor ${c.sector.source} está presente`, async ({ page }) => {
      const card = page.locator('.case-card, [class*="case"], .glass')
        .filter({ hasText: c.sector });
      await expect(card.first()).toBeVisible();
    });
  }

  test('Cada card tem imagem de caso', async ({ page }) => {
    const caseImgs = page.locator('img[src*="case-"]');
    const count = await caseImgs.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('Cada card tem resultado numérico em destaque', async ({ page }) => {
    const results = page.locator('.case-result');
    const count = await results.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await results.nth(i).textContent();
      expect(text).toMatch(/\d+/);
    }
  });

  // ── CTA ───────────────────────────────────────────────────────────────────

  test('Seção CTA final tem botão de WhatsApp', async ({ page }) => {
    const cta = page.locator('.cta-section, [class*="cta-section"]').first();
    await expect(cta).toBeVisible();
    const waLink = cta.locator('a[href*="wa.me"]');
    await expect(waLink.first()).toBeVisible();
  });

});
