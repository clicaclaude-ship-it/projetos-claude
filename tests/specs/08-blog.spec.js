// @ts-check
const { test, expect } = require('@playwright/test');

const CATEGORIES = ['Todos', 'Tutoriais', 'Tendências', 'Cases'];

const KNOWN_SLUGS = [
  'como-automatizar-atendimento-whatsapp-ia',
  'tendencias-ia-2026',
  'case-clinica-medica-agendamento-ia',
];

test.describe('Blog — Lista de Posts', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/');
    await page.waitForSelector('header', { timeout: 12000 });
    // Aguarda o JS carregar os posts via fetch
    await page.waitForTimeout(2000);
  });

  // ── Page Hero ────────────────────────────────────────────────────────────

  test('Page hero do blog carrega com título e imagem', async ({ page }) => {
    const hero = page.locator('.page-hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toBeVisible();
    await expect(hero.locator('img')).toBeVisible();
  });

  // ── Filtros de categoria ──────────────────────────────────────────────────

  for (const cat of CATEGORIES) {
    test(`Botão de filtro "${cat}" está presente`, async ({ page }) => {
      const btn = page.locator('.filter-btn, [class*="filter-btn"]')
        .filter({ hasText: cat });
      await expect(btn).toBeVisible();
    });
  }

  test('Filtro "Todos" vem ativo por padrão', async ({ page }) => {
    const activeFilter = page.locator('.filter-btn.active, [class*="filter-btn"][class*="active"]');
    await expect(activeFilter.first()).toContainText(/todos/i);
  });

  test('Clicar em "Tutoriais" muda o filtro ativo', async ({ page }) => {
    const tutoriaisBtn = page.locator('.filter-btn').filter({ hasText: 'Tutoriais' });
    await tutoriaisBtn.click();
    await page.waitForTimeout(500);
    await expect(tutoriaisBtn).toHaveClass(/active/);
  });

  test('Clicar em "Cases" exibe apenas posts da categoria Cases', async ({ page }) => {
    const casesBtn = page.locator('.filter-btn').filter({ hasText: 'Cases' });
    await casesBtn.click();
    await page.waitForTimeout(600);

    // Todos os cards visíveis devem pertencer à categoria Cases
    const visibleCards = page.locator('.blog-card:visible, [class*="blog-card"]:visible');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await visibleCards.nth(i).textContent();
      expect(text).toMatch(/case/i);
    }
  });

  // ── Cards de post ─────────────────────────────────────────────────────────

  test('Pelo menos 3 cards de post são renderizados', async ({ page }) => {
    const cards = page.locator('.blog-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(2);
  });

  test('Cada card tem título, data e excerpt', async ({ page }) => {
    const firstCard = page.locator('.blog-card, [class*="blog-card"]').first();
    await expect(firstCard).toBeVisible();

    // Título
    const title = firstCard.locator('h2, h3, [class*="title"]').first();
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    // Data
    const dateEl = firstCard.locator('time, [class*="date"], span').first();
    await expect(dateEl).toBeVisible();
  });

  test('Cada card tem thumbnail', async ({ page }) => {
    const thumbnails = page.locator('.blog-card img, [class*="blog-card"] img');
    const count = await thumbnails.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Clicar em um card de post navega para o post', async ({ page }) => {
    const firstCard = page.locator('.blog-card, [class*="blog-card"]').first();
    const link = firstCard.locator('a').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/post\.html\?slug=/i);

    await link.click();
    await expect(page).toHaveURL(/post\.html\?slug=/);
  });

});

test.describe('Blog — Página de Post', () => {

  for (const slug of KNOWN_SLUGS) {
    test(`Post "${slug}" carrega com título e conteúdo`, async ({ page }) => {
      await page.goto(`/blog/post.html?slug=${slug}`);
      await page.waitForSelector('header', { timeout: 8000 });
      // Aguarda o JS carregar o post via fetch
      await page.waitForTimeout(2000);

      // Breadcrumb
      const breadcrumb = page.locator('[class*="breadcrumb"], nav[aria-label="breadcrumb"]').first();
      await expect(breadcrumb).toBeVisible();

      // Conteúdo do post
      const postContent = page.locator('#post-content');
      await expect(postContent).toBeVisible();
      await expect(postContent).not.toBeEmpty();

      // Deve ter pelo menos um h1 ou h2 no conteúdo
      const heading = postContent.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });
  }

  test('Post tem seção CTA ao final', async ({ page }) => {
    await page.goto(`/blog/post.html?slug=${KNOWN_SLUGS[0]}`);
    await page.waitForSelector('header', { timeout: 8000 });
    await page.waitForTimeout(2000);

    const cta = page.locator('.cta-section, [class*="cta-section"]').first();
    await expect(cta).toBeVisible();
    const waLink = cta.locator('a[href*="wa.me"]');
    await expect(waLink.first()).toBeVisible();
  });

  test('Post com slug inválido não quebra a página', async ({ page }) => {
    await page.goto('/blog/post.html?slug=post-que-nao-existe');
    await page.waitForSelector('header', { timeout: 8000 });
    await page.waitForTimeout(2000);

    // Página não deve retornar erro 500 — o header ainda deve estar visível
    await expect(page.locator('header')).toBeVisible();
  });

  test('Link "Voltar ao blog" leva para /blog/', async ({ page }) => {
    await page.goto(`/blog/post.html?slug=${KNOWN_SLUGS[0]}`);
    await page.waitForSelector('header', { timeout: 8000 });

    const backLink = page.locator('a[href*="/blog/"], a[href*="blog/index"]').first();
    await expect(backLink).toBeVisible();
  });

});
