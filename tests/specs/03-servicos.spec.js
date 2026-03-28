// @ts-check
const { test, expect } = require('@playwright/test');

const SERVICES = [
  'Agentes de IA',
  'Automação de Processos',
  'Consultoria',
  'Desenvolvimento',
  'Treinamento',
];

test.describe('Página de Serviços', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/servicos.html');
    await page.waitForSelector('header', { timeout: 8000 });
  });

  // ── Page Hero ────────────────────────────────────────────────────────────

  test('Page hero carrega com título e imagem', async ({ page }) => {
    const hero = page.locator('.page-hero');
    await expect(hero).toBeVisible();

    const h1 = hero.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();

    const img = hero.locator('img');
    await expect(img).toBeVisible();
  });

  // ── Accordion: presença ──────────────────────────────────────────────────

  test('Accordion tem 5 itens de serviço', async ({ page }) => {
    const items = page.locator('.accordion-item, [class*="accordion-item"]');
    await expect(items).toHaveCount(5);
  });

  for (const service of SERVICES) {
    test(`Accordion contém o serviço "${service}"`, async ({ page }) => {
      const item = page.locator('.accordion-item, [class*="accordion-item"]')
        .filter({ hasText: service });
      await expect(item).toBeVisible();
    });
  }

  // ── Accordion: interação ─────────────────────────────────────────────────

  test('Clicar em item fechado expande o conteúdo', async ({ page }) => {
    // O primeiro item já começa aberto; clicamos no segundo (fechado por padrão)
    const secondItem = page.locator('.accordion-item').nth(1);
    const secondBody = secondItem.locator('.accordion-body');

    await expect(secondItem).not.toHaveClass(/open/);
    await secondItem.locator('.accordion-header').click();
    await page.waitForTimeout(500);

    await expect(secondItem).toHaveClass(/open/);
    await expect(secondBody).toBeVisible();
  });

  test('Clicar no item aberto fecha o conteúdo', async ({ page }) => {
    // O primeiro item começa aberto
    const firstItem = page.locator('.accordion-item').nth(0);
    const firstBody = firstItem.locator('.accordion-body');

    await expect(firstItem).toHaveClass(/open/);
    await expect(firstBody).toBeVisible();

    // Clica para fechar
    await firstItem.locator('.accordion-header').click();
    await page.waitForTimeout(500);

    await expect(firstItem).not.toHaveClass(/open/);
    await expect(firstBody).toBeHidden();
  });

  test('Abrir um item fecha o anterior', async ({ page }) => {
    const items = page.locator('.accordion-item');

    // Abre segundo item (primeiro está aberto por padrão)
    await items.nth(1).locator('.accordion-header').click();
    await page.waitForTimeout(500);

    // Segundo deve estar aberto
    await expect(items.nth(1)).toHaveClass(/open/);
    // Primeiro deve estar fechado
    await expect(items.nth(0)).not.toHaveClass(/open/);
  });

  // ── CTA por serviço ──────────────────────────────────────────────────────

  test('Cada item do accordion tem link para WhatsApp', async ({ page }) => {
    const items = page.locator('.accordion-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);

      // Abre o item apenas se estiver fechado (evita fechar o que já está aberto)
      const isOpen = await item.evaluate(el => el.classList.contains('open'));
      if (!isOpen) {
        await item.locator('.accordion-header').click();
        await page.waitForTimeout(500);
      }

      // Verifica link WhatsApp dentro do body aberto
      const waLink = item.locator('.accordion-body a[href*="wa.me"]');
      await expect(waLink.first()).toBeVisible();
    }
  });

});
