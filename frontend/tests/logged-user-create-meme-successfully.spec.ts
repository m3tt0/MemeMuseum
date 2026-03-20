import { test, expect } from '@playwright/test';

test('logged user can create meme', async ({ page }) => {
  await page.goto('/home');

  await page.getByTestId('navbar-pfp-redirect').click();

  await expect(page).toHaveURL(/\/auth\/login/);
  await page.getByTestId('login-username').fill('user1');
  await page.getByTestId('login-password').fill('password1');
  await page.getByTestId('login-submit').click();

  await expect(page.getByRole('alert', { name: /Welcome user1!/i})).toBeVisible();
  await expect(page).toHaveURL(/\/home$/);

  await page.getByTestId('navbar-create').click();
  await expect(page).toHaveURL(/\/create-meme$/);

  await page.getByTestId('meme-file-input').setInputFiles('../frontend/tests/img/meme-test.png');
  await page.getByTestId('meme-caption-input').fill('This is a meme created by Playwright');
  await page.getByTestId('meme-tag-input').fill('playwright');
  await page.getByTestId('meme-tag-add').click();

  await page.getByTestId('meme-submit').click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText(/your meme has been published/i)).toBeVisible();

});