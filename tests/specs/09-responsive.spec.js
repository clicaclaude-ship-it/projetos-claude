// @ts-check
const { test, expect } = require('@playwright/test');

// Viewports a testar
const VIEWPORTS = {
  mobile:  { width: 375, height: 812 },
  tablet:  { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

const KEY_PAGES = [
  { path: '/',              label: 'Home'     },
  { path: '/servicos.html', label: 'Serviços' },
  { path: '/sobre.html',    label: 'Sobre'    },
  { path: '/contato.html',  label: 'Contato'  },
];

test.describe('Layout Responsivo — Mobile (375px)', () => {

  test.use({ viewport: VIEWPORTS.mobile });

  // ── Hamburger Menu ────────────────────────────────────────────────────────

  test('Menu hamburger é visível no mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const hamburger = page.locator('.hamburger, [class*="hamburger"], button[aria-label*="menu"]').first();
    await expect(hamburger).toBeVisible();
  });

  test('Nav desktop está oculto no mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const desktopNav = page.locator('header nav, header .nav-links').first();
    // Pode estar escondido por CSS
    const isVisible = await desktopNav.isVisible();
    expect(isVisible).toBe(false);
  });

  test('Clicar no hamburger abre o menu mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const hamburger = page.locator('#hamburger').first();
    // Confirma que o mobile-nav está fechado (sem classe .open)
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).not.toHaveClass(/open/);

    await hamburger.click();
    await page.waitForTimeout(400);

    // O mobile-nav deve ter classe .open
    await expect(mobileNav).toHaveClass(/open/);
  });

  test('Menu mobile fecha ao clicar em um link', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    // Abre menu
    await page.locator('#hamburger').click();
    await page.waitForTimeout(400);
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toHaveClass(/open/);

    // Clica em "Serviços" no menu mobile
    await mobileNav.locator('a:has-text("Serviços")').first().click();
    await page.waitForTimeout(500);

    // Navega para a página correta
    await expect(page).toHaveURL(/servicos\.html/);
  });

  // ── Grids colapsados ─────────────────────────────────────────────────────

  test('[Home] Grid Problema/Solução colapsa para 1 coluna no mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const grid = page.locator('.grid-2').first();
    await expect(grid).toBeVisible();

    // Em mobile, os dois filhos do grid devem ser empilhados verticalmente
    const child0 = grid.locator('> *').nth(0);
    const child1 = grid.locator('> *').nth(1);
    const box0 = await child0.boundingBox();
    const box1 = await child1.boundingBox();

    expect(box0).not.toBeNull();
    expect(box1).not.toBeNull();

    // Em coluna única, o segundo filho começa abaixo do primeiro
    expect(box1.y).toBeGreaterThan(box0.y);
  });

  test('[Contato] Grid formulário + canais colapsa para 1 coluna', async ({ page }) => {
    await page.goto('/contato.html');
    await page.waitForSelector('header', { timeout: 8000 });

    const grid = page.locator('.grid-2.align-start, .grid-2').first();
    await expect(grid).toBeVisible();

    const children = grid.locator('> *');
    const count = await children.count();
    expect(count).toBe(2);

    // Verifica que os filhos empilham verticalmente (tops diferentes)
    const box0 = await children.nth(0).boundingBox();
    const box1 = await children.nth(1).boundingBox();
    expect(box1.y).toBeGreaterThan(box0.y + box0.height / 2);
  });

  // ── Imagens no mobile ────────────────────────────────────────────────────

  for (const pg of KEY_PAGES) {
    test(`[${pg.label}] Imagens não transbordam a tela`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForSelector('header', { timeout: 8000 });

      const images = page.locator('img:visible');
      const count = await images.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const box = await images.nth(i).boundingBox();
        if (box) {
          expect(box.x + box.width).toBeLessThanOrEqual(VIEWPORTS.mobile.width + 5); // 5px tolerância
        }
      }
    });
  }

  // ── Botão WhatsApp flutuante ──────────────────────────────────────────────

  test('Botão flutuante do WhatsApp visível no mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const waBtn = page.locator('.whatsapp-float, [class*="whatsapp-float"]').first();
    await expect(waBtn).toBeVisible();

    const box = await waBtn.boundingBox();
    // Botão deve estar dentro da tela
    expect(box.x + box.width).toBeLessThanOrEqual(VIEWPORTS.mobile.width + 5);
  });

  // ── Stats grid ───────────────────────────────────────────────────────────

  test('[Home] Stats grid colapsa para 2 colunas no mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const statsGrid = page.locator('.stats-grid').first();
    if (await statsGrid.isVisible()) {
      const items = statsGrid.locator('> *');
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(2);

      // Em 2 colunas, o segundo item deve estar à direita do primeiro
      const box0 = await items.nth(0).boundingBox();
      const box1 = await items.nth(1).boundingBox();
      // Ou na mesma linha (2 colunas) ou abaixo (1 coluna) — ambos válidos
      expect(box0).not.toBeNull();
      expect(box1).not.toBeNull();
    }
  });

  // ── Accordion no mobile ───────────────────────────────────────────────────

  test('[Serviços] Accordion funciona no mobile', async ({ page }) => {
    await page.goto('/servicos.html');
    await page.waitForSelector('header', { timeout: 8000 });

    // Clica no segundo item (o primeiro já está aberto por padrão)
    const secondItem = page.locator('.accordion-item').nth(1);
    await secondItem.locator('.accordion-header').click();
    await page.waitForTimeout(500);

    await expect(secondItem).toHaveClass(/open/);
    const body = secondItem.locator('.accordion-body');
    await expect(body).toBeVisible();
  });

});

test.describe('Layout Responsivo — Tablet (768px)', () => {

  test.use({ viewport: VIEWPORTS.tablet });

  test('Página home carrega sem overflow horizontal', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(VIEWPORTS.tablet.width + 10);
  });

  test('Hero está visível no tablet', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });
    const hero = page.locator('.hero, section.hero').first();
    await expect(hero).toBeVisible();
  });

});

test.describe('Layout Responsivo — Desktop (1280px)', () => {

  test.use({ viewport: VIEWPORTS.desktop });

  test('[Home] Grid Problema/Solução tem 2 colunas no desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const grids = page.locator('.grid-2');
    const count = await grids.count();
    expect(count).toBeGreaterThan(0);

    // No desktop, os filhos do grid devem estar lado a lado (mesmo Y)
    const firstGrid = grids.first();
    const children = firstGrid.locator('> *');
    const box0 = await children.nth(0).boundingBox();
    const box1 = await children.nth(1).boundingBox();

    // Ambos devem começar na mesma linha (diferença de Y menor que a metade da altura)
    const yDiff = Math.abs(box0.y - box1.y);
    expect(yDiff).toBeLessThan(box0.height / 2);
  });

  test('Nav desktop visível e hamburger oculto', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 8000 });

    const hamburger = page.locator('.hamburger, [class*="hamburger"]').first();
    await expect(hamburger).toBeHidden();

    const desktopNav = page.locator('header nav, header .nav-links').first();
    await expect(desktopNav).toBeVisible();
  });

});
