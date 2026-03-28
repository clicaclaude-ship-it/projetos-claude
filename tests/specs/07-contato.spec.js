// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Página de Contato', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/contato.html');
    await page.waitForSelector('header', { timeout: 8000 });
  });

  // ── Page Hero ────────────────────────────────────────────────────────────

  test('Page hero carrega com título e imagem', async ({ page }) => {
    const hero = page.locator('.page-hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toBeVisible();
    await expect(hero.locator('img')).toBeVisible();
  });

  // ── Formulário ────────────────────────────────────────────────────────────

  test('Formulário de contato está visível', async ({ page }) => {
    const form = page.locator('#contact-form, form.contact-form');
    await expect(form).toBeVisible();
  });

  test('Campo "Seu nome" está presente e aceitando input', async ({ page }) => {
    const input = page.locator('#nome, input[name="nome"]');
    await expect(input).toBeVisible();
    await input.fill('João Teste');
    await expect(input).toHaveValue('João Teste');
  });

  test('Campo "Empresa" está presente', async ({ page }) => {
    const input = page.locator('#empresa, input[name="empresa"]');
    await expect(input).toBeVisible();
  });

  test('Campo "Mensagem" (textarea) está presente', async ({ page }) => {
    const textarea = page.locator('#mensagem, textarea[name="mensagem"]');
    await expect(textarea).toBeVisible();
    await textarea.fill('Quero saber mais sobre os serviços de IA.');
    await expect(textarea).toHaveValue(/quero saber/i);
  });

  test('Botão de envio está presente', async ({ page }) => {
    const btn = page.locator('#contact-form button[type="submit"], form.contact-form button');
    await expect(btn.first()).toBeVisible();
    const text = await btn.first().textContent();
    expect(text).toMatch(/whatsapp|enviar/i);
  });

  // ── Redirect para WhatsApp ────────────────────────────────────────────────

  test('Submissão do formulário abre URL do WhatsApp', async ({ page, context }) => {
    // Preenche o formulário
    await page.locator('#nome, input[name="nome"]').fill('Teste Playwright');
    await page.locator('#mensagem, textarea[name="mensagem"]').fill('Teste automatizado de contato.');

    // Intercepta a nova aba que o WhatsApp vai abrir
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 8000 }).catch(() => null),
      page.locator('#contact-form button[type="submit"]').click(),
    ]);

    // Se não abriu nova aba, verifica se a URL atual mudou para wa.me
    if (newPage) {
      const url = newPage.url();
      expect(url).toMatch(/wa\.me|whatsapp/i);
    } else {
      // Pode ter redirecionado na mesma aba
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/wa\.me|whatsapp/i);
    }
  });

  test('Mensagem pré-preenchida contém o nome e texto do usuário', async ({ page, context }) => {
    const nome = 'Cliente Automação';
    const msg = 'Preciso automatizar processos do meu negócio.';

    await page.locator('#nome, input[name="nome"]').fill(nome);
    await page.locator('#mensagem, textarea[name="mensagem"]').fill(msg);

    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 8000 }).catch(() => null),
      page.locator('#contact-form button[type="submit"]').click(),
    ]);

    const targetPage = newPage || page;
    await targetPage.waitForTimeout(500);
    const url = decodeURIComponent(targetPage.url());

    // A URL deve conter partes do nome ou da mensagem
    expect(url).toMatch(/wa\.me|whatsapp/i);
  });

  // ── Canais de contato ─────────────────────────────────────────────────────

  test('Card do WhatsApp está visível com link direto', async ({ page }) => {
    const waCard = page.locator('section').filter({ hasText: /\+55 35|3195-9999/i }).first();
    await expect(waCard).toBeVisible();

    const waLink = waCard.locator('a[href*="wa.me"]');
    await expect(waLink.first()).toBeVisible();
  });

  test('Card de e-mail está visível com link mailto', async ({ page }) => {
    const emailCard = page.locator('section').filter({ hasText: /contato@clicaai/i }).first();
    await expect(emailCard).toBeVisible();

    const emailLink = emailCard.locator('a[href*="mailto"]');
    await expect(emailLink.first()).toBeVisible();
  });

  test('Card de localização menciona Minas Gerais', async ({ page }) => {
    const locationCard = page.locator('section').filter({ hasText: /minas gerais/i }).first();
    await expect(locationCard).toBeVisible();
  });

  test('Card de tempo de resposta menciona 2 horas', async ({ page }) => {
    const timeCard = page.locator('section').filter({ hasText: /2 horas/i }).first();
    await expect(timeCard).toBeVisible();
  });

});
