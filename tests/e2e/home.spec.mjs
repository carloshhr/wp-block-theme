import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test('tool cards toggle independently with mouse and keyboard', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const cards = page.locator('.terminal-tool-card');
  await expect(cards).toHaveCount(6);
  const first = cards.nth(0);
  const second = cards.nth(1);
  const firstButton = first.getByRole('button');
  const secondButton = second.getByRole('button');
  await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  const description = first.locator('p');
  await expect(description).toBeHidden();
  await expect(firstButton).toHaveAttribute('aria-controls', await description.getAttribute('id'));
  await firstButton.click();
  await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  await expect(description).toBeVisible();
  await expect(secondButton).toHaveAttribute('aria-expanded', 'false');
  await secondButton.focus();
  await page.keyboard.press('Enter');
  await expect(secondButton).toHaveAttribute('aria-expanded', 'true');
  await firstButton.focus();
  await page.keyboard.press('Space');
  await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  await expect(secondButton).toHaveAttribute('aria-expanded', 'true');
  expect(errors).toEqual([]);
});

test('tools adapt to narrow and wide viewports', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  const cards = page.locator('.terminal-tool-card');
  await expect(cards).toHaveCount(6);
  const narrow = await cards.first().boundingBox();
  const narrowSecond = await cards.nth(1).boundingBox();
  expect(narrowSecond.y).toBeGreaterThan(narrow.y);
  await page.setViewportSize({ width: 1200, height: 800 });
  const wide = await cards.first().boundingBox();
  const wideSecond = await cards.nth(1).boundingBox();
  expect(Math.abs(wideSecond.y - wide.y)).toBeLessThan(5);
  expect(wideSecond.x).toBeGreaterThan(wide.x);
});
