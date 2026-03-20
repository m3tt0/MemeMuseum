import { test, expect } from '@playwright/test';

test('logged user can logout and redirected to login', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByTestId('login-username').fill('user1');
  await page.getByTestId('login-password').fill('password1');
  await page.getByTestId('login-submit').click();

  await expect(page.getByText(/welcome user1/i)).toBeVisible();
  await expect(page).toHaveURL('/home');

  await page.getByTestId('navbar-dropdown').click();
  await page.getByTestId('logout-button').click();

  await expect(page.getByText(/successfully logged out/i)).toBeVisible();
  await expect(page).toHaveURL('/auth/login');

});