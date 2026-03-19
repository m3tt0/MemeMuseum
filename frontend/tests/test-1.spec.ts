import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/auth/signup');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('user1');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password1');
  await page.getByRole('button', { name: 'SIGNUP' }).click();
  await expect(page.getByText('Congrats user1! You can now')).toBeVisible();
  await page.getByTestId('login-username').click();
  await page.getByTestId('login-username').fill('user1');
  await page.getByTestId('login-username').press('Tab');
  await page.getByTestId('login-password').fill('password1');
  await page.getByTestId('login-submit').click();
  await expect(page.locator('div').filter({ hasText: 'Welcome user1!' }).nth(2)).toBeVisible();
});