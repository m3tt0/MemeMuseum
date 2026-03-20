import { test, expect } from '@playwright/test';

test('logged user can open comments section and add a comment', async ({ page }) => {
  await page.goto('/home');

  await page.getByTestId('navbar-pfp-redirect').click();

  await expect(page).toHaveURL(/\/auth\/login/);

  await page.getByTestId('login-username').fill('user1');
  await page.getByTestId('login-password').fill('password1');
  await page.getByTestId('login-submit').click();

  await expect(page.getByRole('alert', { name: /Welcome user1!/i })).toBeVisible();
  await expect(page).toHaveURL('/home');

  const memeCard = page.locator('app-meme-card').first();
  const commentsButton = memeCard.getByTestId('comments-button');

  await commentsButton.click();

  const commentsSection = page.getByTestId('comments-modal');
  await expect(commentsSection).toBeVisible();

  const playwrightComment = `Playwright comment ${Date.now()}`;

  await commentsSection.getByTestId('comment-input').fill(playwrightComment);
  await commentsSection.getByTestId('comment-submit').click();

  await expect(commentsSection.getByText(playwrightComment)).toBeVisible();
  await expect(page.getByRole('alert', { name: /Comment added/i})).toBeVisible();

});