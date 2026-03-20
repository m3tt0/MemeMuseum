import { test, expect } from '@playwright/test';

test('guest cannot access create meme page', async ({ page }) => {
  await page.goto('/create-meme');

  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByTestId('login-submit')).toBeVisible();
});