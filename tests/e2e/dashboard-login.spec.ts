import { test, expect } from '@playwright/test';

test.describe('Dashboard Login', () => {
  test('deve exibir página de login', async ({ page }) => {
    await page.goto('/dashboard/login');

    // Verificar título
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();

    // Verificar campos de formulário
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Senha/i)).toBeVisible();

    // Verificar botão de login
    await expect(page.getByRole('button', { name: /Entrar/i })).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.goto('/dashboard/login');

    // Tentar fazer login sem preencher campos
    await page.getByRole('button', { name: /Entrar/i }).click();

    // Verificar mensagens de validação do HTML5
    const emailInput = page.getByLabel(/Email/i);
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('deve redirecionar para dashboard após login bem-sucedido', async ({ page }) => {
    // Nota: Este teste requer credenciais válidas e não deve rodar em CI sem mock
    test.skip();
  });

  test('deve proteger rota do dashboard', async ({ page }) => {
    // Tentar acessar dashboard diretamente sem login
    await page.goto('/dashboard');

    // Deve redirecionar para login
    await expect(page).toHaveURL(/\/dashboard\/login/);
  });

  test('deve ter design responsivo', async ({ page }) => {
    await page.goto('/dashboard/login');

    // Testar em viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();

    // Testar em viewport tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();

    // Testar em viewport desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();
  });
});

test.describe('Dashboard Protected Routes', () => {
  test('deve proteger todas as rotas do dashboard', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/dashboard/relatorios'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      // Deve redirecionar para login
      await expect(page).toHaveURL(/\/dashboard\/login/);
    }
  });
});
