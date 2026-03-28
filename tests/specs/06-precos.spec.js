// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Página de Preços', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/precos.html');
    await page.waitForSelector('header', { timeout: 8000 });
  });

  // ── Page Hero ────────────────────────────────────────────────────────────

  test('Page hero carrega com título e imagem', async ({ page }) => {
    const hero = page.locator('.page-hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toBeVisible();
    await expect(hero.locator('img')).toBeVisible();
  });

  test('Título da hero menciona "único" ou personalizado', async ({ page }) => {
    const h1 = page.locator('.page-hero h1');
    await expect(h1).toContainText(/único|personaliz/i);
  });

  // ── Processo em 4 passos ─────────────────────────────────────────────────

  test('Seção "Como funciona" está visível', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /como funciona/i }).first();
    await expect(section).toBeVisible();
  });

  test('Existem 4 etapas do processo', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /como funciona/i }).first();
    const steps = section.locator('.service-card');
    const count = await steps.count();
    expect(count).toBe(4);
  });

  test('Etapas têm numeração 01 a 04', async ({ page }) => {
    for (let n = 1; n <= 4; n++) {
      const num = String(n).padStart(2, '0');
      const step = page.locator('.service-card').filter({ hasText: num });
      await expect(step.first()).toBeVisible();
    }
  });

  // ── O que está incluído ───────────────────────────────────────────────────

  test('Seção "O que você recebe" está visível', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /o que você recebe|parceiro/i }).first();
    await expect(section).toBeVisible();
  });

  test('Lista de benefícios tem pelo menos 6 itens', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /o que você recebe|parceiro/i }).first();
    const benefitItems = section.locator('strong');
    const count = await benefitItems.count();
    expect(count).toBeGreaterThan(4);
  });

  // ── CTA ───────────────────────────────────────────────────────────────────

  test('CTA final tem botão de WhatsApp para proposta', async ({ page }) => {
    const cta = page.locator('.cta-section, [class*="cta-section"]').first();
    await expect(cta).toBeVisible();

    const waLink = cta.locator('a[href*="wa.me"]');
    await expect(waLink.first()).toBeVisible();

    const text = await waLink.first().textContent();
    expect(text).toMatch(/proposta|quero/i);
  });

  test('CTA menciona prazo de resposta (48h)', async ({ page }) => {
    const cta = page.locator('.cta-section, [class*="cta-section"]').first();
    await expect(cta).toContainText(/48h|48 horas/i);
  });

});
