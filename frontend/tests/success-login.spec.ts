import { test, expect } from '@playwright/test';

test('user can login with valid credentials', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByTestId('login-username').fill('user3');
  await page.getByTestId('login-password').fill('password3');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText('MemeMuseum')).toBeVisible();
});