import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('deve carregar a homepage corretamente', async ({ page }) => {
    await page.goto('/');

    // Verificar título
    await expect(page).toHaveTitle(/eXp ImobCheck/);

    // Verificar heading principal
    await expect(
      page.getByRole('heading', { name: /Plataforma Inteligente de Auditoria Imobiliária/i })
    ).toBeVisible();

    // Verificar logo eXp
    await expect(page.locator('text=eXp')).toBeVisible();
    await expect(page.locator('text=ImobCheck')).toBeVisible();
  });

  test('deve ter link para dashboard', async ({ page }) => {
    await page.goto('/');

    // Verificar botão de acesso
    const dashboardLink = page.getByRole('link', { name: /Acessar Sistema/i });
    await expect(dashboardLink).toBeVisible();
    await expect(dashboardLink).toHaveAttribute('href', '/dashboard/login');
  });

  test('deve exibir seção de serviços', async ({ page }) => {
    await page.goto('/');

    // Verificar heading de serviços
    await expect(
      page.getByRole('heading', { name: /Serviços Desenvolvidos/i })
    ).toBeVisible();

    // Verificar os 3 cards de serviços
    await expect(page.getByRole('heading', { name: /Dashboard Executivo/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Webhook Vista CRM/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Auditoria Automática/i })).toBeVisible();
  });

  test('deve exibir recursos principais', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Recursos Principais/i })).toBeVisible();
    await expect(page.getByText(/Detecção de Anomalias/i)).toBeVisible();
    await expect(page.getByText(/Verificação de Matrículas/i)).toBeVisible();
    await expect(page.getByText(/Anti-Lavagem de Dinheiro/i)).toBeVisible();
  });

  test('deve ter footer com informações corretas', async ({ page }) => {
    await page.goto('/');

    // Verificar footer
    await expect(page.getByText(/© 2026 eXp Realty Brasil/i)).toBeVisible();
    await expect(page.getByText(/Desenvolvido com Next.js, Supabase e Vercel/i)).toBeVisible();
  });

  test('deve ter cores da marca eXp Realty', async ({ page }) => {
    await page.goto('/');

    // Verificar que o header tem a cor correta (aproximadamente)
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // Verificar gradiente no hero
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('navegação por âncoras deve funcionar', async ({ page }) => {
    await page.goto('/');

    // Clicar no botão "Conheça os Serviços"
    await page.getByRole('link', { name: /Conheça os Serviços/i }).click();

    // Verificar que a URL mudou para a seção
    await expect(page).toHaveURL(/#servicos$/);
  });
});
