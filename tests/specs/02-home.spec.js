// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Home — Página Inicial', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });
  });

  // ── Hero ──────────────────────────────────────────────────────────────────

  test('Hero tem título principal e subtítulo', async ({ page }) => {
    const hero = page.locator('section.hero, .hero');
    await expect(hero.first()).toBeVisible();

    // H1 presente
    const h1 = page.locator('.hero h1, section.hero h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();
  });

  test('Hero tem imagem/SVG carregado', async ({ page }) => {
    const heroImg = page.locator('.hero img[src*="hero-home"], .hero-image img').first();
    await expect(heroImg).toBeVisible();
  });

  test('Hero tem dois botões de CTA', async ({ page }) => {
    const ctaBtns = page.locator('.hero .hero-buttons a, .hero .btn');
    await expect(ctaBtns).toHaveCount(2);
  });

  test('CTA principal do hero aponta para WhatsApp', async ({ page }) => {
    const primaryCta = page.locator('.hero .btn-primary, .hero .btn-whatsapp').first();
    const href = await primaryCta.getAttribute('href');
    expect(href).toMatch(/wa\.me|whatsapp/i);
  });

  // ── Seção Problema ────────────────────────────────────────────────────────

  test('Seção "O Problema" está visível com imagem e texto', async ({ page }) => {
    // Procura por texto característico da seção problema
    const section = page.locator('section').filter({ hasText: /problema|manualmente|ineficiência|tempo perdido/i }).first();
    await expect(section).toBeVisible();

    // Imagem da seção
    const img = section.locator('img').first();
    await expect(img).toBeVisible();
  });

  // ── Seção Solução ────────────────────────────────────────────────────────

  test('Seção "A Solução" está visível com imagem e texto', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /solução|transforma|inteligência artificial/i }).first();
    await expect(section).toBeVisible();

    const img = section.locator('img').first();
    await expect(img).toBeVisible();
  });

  // ── Stats ─────────────────────────────────────────────────────────────────

  test('Seção de métricas/stats exibe números de resultado', async ({ page }) => {
    const statsSection = page.locator('.stats-grid, [class*="stats"]').first();
    await expect(statsSection).toBeVisible();

    // Deve ter pelo menos 3 números/percentuais
    const statItems = page.locator('.stat-item, [class*="stat-item"]');
    const count = await statItems.count();
    expect(count).toBeGreaterThan(2);
  });

  // ── Serviços na home ──────────────────────────────────────────────────────

  test('Seção de serviços exibe cards', async ({ page }) => {
    const serviceCards = page.locator('.service-card, [class*="service-card"]');
    await expect(serviceCards.first()).toBeVisible();
  });

  // ── Preview do Blog ───────────────────────────────────────────────────────

  test('Preview de posts do blog aparece na home', async ({ page }) => {
    // Aguarda o JS carregar os posts
    await page.waitForTimeout(1500);
    const blogSection = page.locator('section').filter({ hasText: /blog|artigos|conteúdo/i }).first();
    await expect(blogSection).toBeVisible();
  });

  // ── CTA Final ─────────────────────────────────────────────────────────────

  test('Seção CTA final tem botão de WhatsApp', async ({ page }) => {
    const cta = page.locator('.cta-section, [class*="cta-section"]').first();
    await expect(cta).toBeVisible();

    const waLink = cta.locator('a[href*="wa.me"]');
    await expect(waLink.first()).toBeVisible();
  });

  // ── SEO ───────────────────────────────────────────────────────────────────

  test('Página tem title e meta description', async ({ page }) => {
    const title = await page.title();
    expect(title).not.toBe('');
    expect(title).toMatch(/clica.ai/i);

    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute('content');
    expect(content).not.toBe('');
  });

});
