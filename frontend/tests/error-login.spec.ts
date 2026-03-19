import { test, expect } from '@playwright/test';

test('user cannot login with invalid credentials', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByTestId('login-username').fill('user3');
  await page.getByTestId('login-password').fill('wrongPassword');
  await page.getByTestId('login-submit').click();
  
  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByText(/Invalid username or password, try again !/i)).toBeVisible();
});