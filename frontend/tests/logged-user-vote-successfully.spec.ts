import { test, expect } from '@playwright/test';

test('logged user can toggle upvote on a meme', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByTestId('login-username').fill('user1');
  await page.getByTestId('login-password').fill('password1');
  await page.getByTestId('login-submit').click();

  await expect(page.getByRole('alert', { name: /Welcome user1!/i })).toBeVisible();

  const memeCard = page.locator('app-meme-card').first();
  const upvoteButton = memeCard.getByTestId('upvote-button');
  const voteCount = memeCard.getByTestId('upvote-count');

  const initialPressed = await upvoteButton.getAttribute('aria-pressed');
  const initialVotes = Number((await voteCount.textContent())?.trim());

  await upvoteButton.click();

  if (initialPressed === 'true') {
    await expect(upvoteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(voteCount).toHaveText(String(initialVotes - 1));
  } else {
    await expect(upvoteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(voteCount).toHaveText(String(initialVotes + 1));
  }

});