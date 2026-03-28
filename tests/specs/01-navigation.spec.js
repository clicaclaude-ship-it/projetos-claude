// @ts-check
const { test, expect } = require('@playwright/test');

const PAGES = [
  { path: '/',             label: 'Home'     },
  { path: '/servicos.html', label: 'Serviços' },
  { path: '/sobre.html',    label: 'Sobre'    },
  { path: '/cases.html',    label: 'Cases'    },
  { path: '/precos.html',   label: 'Preços'   },
  { path: '/contato.html',  label: 'Contato'  },
  { path: '/blog/',         label: 'Blog'     },
];

// Nav links visíveis no desktop (nav.nav-links). Preços está em .nav-cta, Contato só no menu mobile.
const DESKTOP_NAV_LINKS = ['Serviços', 'Cases', 'Blog', 'Sobre'];
const NAV_CTA_LINKS = ['Preços'];

test.describe('Navegação Global', () => {

  // ── Header ────────────────────────────────────────────────────────────────

  for (const page of PAGES) {
    test(`[${page.label}] Header carrega com logo e links`, async ({ page: pw }) => {
      await pw.goto(page.path);

      // Header visível
      const header = pw.locator('header, #header-placeholder ~ header, [id*="header"]').first();
      // O header é carregado via fetch, então aguardamos ele existir no DOM
      await pw.waitForSelector('header', { timeout: 8000 });

      // Logo presente
      const logo = pw.locator('header .logo, header [class*="logo"]');
      await expect(logo.first()).toBeVisible();

      // Links no nav desktop (nav.nav-links)
      for (const link of DESKTOP_NAV_LINKS) {
        const navLink = pw.locator(`header .nav-links a:has-text("${link}")`).first();
        await expect(navLink).toBeVisible();
      }
      // Preços fica no .nav-cta (botão)
      for (const link of NAV_CTA_LINKS) {
        const ctaLink = pw.locator(`header .nav-cta a:has-text("${link}")`).first();
        await expect(ctaLink).toBeVisible();
      }
    });
  }

  // ── Link ativo ───────────────────────────────────────────────────────────

  test('Serviços está ativo em /servicos.html', async ({ page }) => {
    await page.goto('/servicos.html');
    await page.waitForSelector('header');
    const activeLink = page.locator('.nav-links a.active, .mobile-nav a.active');
    await expect(activeLink.first()).toContainText(/serviços/i);
  });

  test('Blog está ativo em /blog/', async ({ page }) => {
    await page.goto('/blog/');
    await page.waitForSelector('header', { timeout: 10000 });
    const activeLink = page.locator('.nav-links a.active, .mobile-nav a.active');
    await expect(activeLink.first()).toContainText(/blog/i);
  });

  // ── Footer ───────────────────────────────────────────────────────────────

  for (const pg of PAGES) {
    test(`[${pg.label}] Footer carrega com colunas e copyright`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForSelector('footer', { timeout: 8000 });

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Texto de copyright
      await expect(footer).toContainText(/clica.ai/i);

      // Links de serviços no footer
      await expect(footer.locator('a').first()).toBeVisible();
    });
  }

  // ── WhatsApp Float ───────────────────────────────────────────────────────

  for (const pg of PAGES) {
    test(`[${pg.label}] Botão flutuante do WhatsApp visível`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForSelector('header', { timeout: 8000 });

      const waBtn = page.locator('.whatsapp-float, [class*="whatsapp-float"], a[href*="wa.me"][class*="float"]');
      await expect(waBtn.first()).toBeVisible();
    });
  }

  // ── Links internos ───────────────────────────────────────────────────────

  test('Link "Serviços" do header navega para /servicos.html', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
    await page.locator('.nav-links a:has-text("Serviços")').first().click();
    await expect(page).toHaveURL(/servicos\.html/);
  });

  test('Link "Contato" existe no menu mobile com href correto', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
    // Contato está apenas no menu mobile (oculto no desktop via CSS)
    const contatoLink = page.locator('.mobile-nav a:has-text("Contato")');
    // Verifica href sem exigir visibilidade (menu mobile está fechado no desktop)
    const href = await contatoLink.getAttribute('href');
    expect(href).toMatch(/contato\.html/);
  });

});
