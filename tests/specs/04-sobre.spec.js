// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Página Sobre', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/sobre.html');
    await page.waitForSelector('header', { timeout: 8000 });
  });

  // ── Page Hero ────────────────────────────────────────────────────────────

  test('Page hero carrega com título e imagem', async ({ page }) => {
    const hero = page.locator('.page-hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toBeVisible();
    await expect(hero.locator('img')).toBeVisible();
  });

  // ── Missão / Visão ───────────────────────────────────────────────────────

  test('Seção Missão e Visão está visível', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /missão|visão/i }).first();
    await expect(section).toBeVisible();
  });

  test('Grid Missão/Visão tem dois cards', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /missão|visão/i }).first();
    const cards = section.locator('.glass');
    const count = await cards.count();
    expect(count).toBeGreaterThan(1);
  });

  // ── História ─────────────────────────────────────────────────────────────

  test('Seção História está visível com texto', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /chegamos aqui|inovação e propósito/i }).first();
    await expect(section).toBeVisible();
    await expect(section.locator('h2')).toBeVisible();
  });

  // ── Equipe ────────────────────────────────────────────────────────────────

  test('Seção Equipe tem 4 membros', async ({ page }) => {
    const teamSection = page.locator('section').filter({ hasText: /equipe|time/i }).first();
    await expect(teamSection).toBeVisible();

    const teamCards = teamSection.locator('.glass');
    const count = await teamCards.count();
    expect(count).toBeGreaterThan(2);
  });

  test('Avatares da equipe carregam (imagens SVG)', async ({ page }) => {
    const teamImgs = page.locator('img[src*="team-"]');
    const count = await teamImgs.count();
    expect(count).toBeGreaterThanOrEqual(4);

    // Cada imagem visível
    for (let i = 0; i < count; i++) {
      await expect(teamImgs.nth(i)).toBeVisible();
    }
  });

  // ── Valores ───────────────────────────────────────────────────────────────

  test('Seção Valores tem pelo menos 3 cards de valor', async ({ page }) => {
    const valuesSection = page.locator('section').filter({ hasText: /valores|princípios/i }).first();
    await expect(valuesSection).toBeVisible();

    const valueCards = valuesSection.locator('.service-card');
    const count = await valueCards.count();
    expect(count).toBeGreaterThan(2);
  });

});
