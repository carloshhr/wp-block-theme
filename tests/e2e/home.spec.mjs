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

test('front-page link opens the native posts index', async ({ page }) => {
  await page.goto('/');
  const allPosts = page.getByRole('link', { name: 'All posts' });
  await expect(allPosts).toHaveAttribute('href', '/blog/');
  const navigation = page.waitForResponse((response) => response.url().endsWith('/blog/') && response.request().isNavigationRequest());
  await allPosts.click();
  const response = await navigation;
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page.getByRole('heading', { name: 'All posts' })).toBeVisible();
  await expect(page.locator('.wp-block-query .wp-block-post-template')).toBeVisible();
});

test('a published blog post renders its own title and full body', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'All posts' })).toBeVisible();
  await page.goto('/blog/');
  await expect(page.getByRole('heading', { name: 'All posts' })).toBeVisible();
  const post = page.locator('.wp-block-query .wp-block-post-template > li').first();
  await expect(post).toBeVisible();
  const link = post.locator('.wp-block-post-title a');
  const title = (await link.innerText()).trim();
  expect(title.length).toBeGreaterThan(0);
  const href = await link.getAttribute('href');
  expect(href).toBeTruthy();
  await link.click();
  await expect(page).toHaveURL(href);
  await expect(page.locator('main h1.wp-block-post-title')).toHaveText(title);
  const body = page.locator('main .wp-block-post-content');
  await expect(body).toBeVisible();
  expect((await body.innerText()).trim().length).toBeGreaterThan(0);
});

test('posts index paginates without repeating titles', async ({ page }) => {
  const titles = () => page.locator('.wp-block-query .wp-block-post-template .wp-block-post-title').allTextContents();
  await page.goto('/blog/');
  await expect(page.locator('.wp-block-query .wp-block-post-template > li')).toHaveCount(10);
  const first = (await titles()).map((title) => title.trim());
  expect(first).toHaveLength(10);
  await page.locator('.wp-block-query-pagination-next').click();
  await expect(page).toHaveURL(/\/blog\/page\/2\/$/);
  await expect(page.locator('.wp-block-query .wp-block-post-template > li')).toHaveCount(1);
  const second = (await titles()).map((title) => title.trim());
  expect(second).toHaveLength(1);
  expect(new Set([...first, ...second]).size).toBe(11);
  await page.locator('.wp-block-query-pagination-previous').click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page.locator('.wp-block-query .wp-block-post-template > li')).toHaveCount(10);
  expect((await titles()).map((title) => title.trim())).toEqual(first);
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
