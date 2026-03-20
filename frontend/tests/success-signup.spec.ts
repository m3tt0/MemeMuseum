import { test, expect } from '@playwright/test';

test('user creating new account successfully', async ({ page }) => {
  const username = `user_${Date.now()}`;
  const password = 'password123';

  await page.goto('/auth/signup');

  await page.getByTestId('signup-username').fill(username);
  await page.getByTestId('signup-password').fill(password);
  await page.getByTestId('signup-submit').click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByLabel(`Congrats ${username}!`)).toBeVisible();

});