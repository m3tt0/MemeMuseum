import { test, expect } from '@playwright/test';

test('logged user can update profile picture successfully', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByTestId('login-username').fill('user1');
  await page.getByTestId('login-password').fill('password1');
  await page.getByTestId('login-submit').click();

  await expect(page.getByText(/Welcome user1/i)).toBeVisible();
  await expect(page).toHaveURL('/home');

  await page.getByTestId('navbar-dropdown').click();
  await page.getByTestId('update-pfp-button').click();

  const updatePfpModal = page.getByTestId('update-pfp-modal');
  await expect(updatePfpModal).toBeVisible();

  await page.getByTestId('pfp-input').setInputFiles('../frontend/tests/img/pfp-test.jpg');
  await page.getByTestId('pfp-submit').click();

  await expect(page.getByRole('alert', { name: /profile picture updated successfully/i})).toBeVisible();
});