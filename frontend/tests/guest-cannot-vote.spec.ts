import { test, expect } from '@playwright/test';

test('guest user cannot upvote a meme and sees error toast', async ({ page }) => {
  await page.goto('/');

  const memeCard = page.locator('app-meme-card').first();
  const upvoteButton = memeCard.getByTestId('upvote-button');
  const voteCount = memeCard.getByTestId('upvote-count');

  const initialVotes = Number((await voteCount.textContent())?.trim());

  await upvoteButton.click();

  await expect(page.getByText(/Authentication required/i)).toBeVisible();
  await expect(voteCount).toHaveText(String(initialVotes));
});