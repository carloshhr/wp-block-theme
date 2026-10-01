import { test, expect } from '@playwright/test';

const isolatedURL = 'http://localhost:8890';

test.beforeAll(async ({ baseURL }) => {
  if (baseURL !== isolatedURL) {
    throw new Error(`Editor persistence requires WP_BASE_URL=${isolatedURL}; refusing to edit ${baseURL}`);
  }
});

async function openEditor(page) {
  await page.goto('/wp-login.php');
  await page.getByLabel('Username or Email Address').fill('admin');
  await page.locator('#user_pass').fill('password');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL(/\/wp-admin\//);
  await page.goto('/wp-admin/site-editor.php?postType=wp_template&postId=block-theme%2F%2Ffront-page&canvas=edit');
  const welcome = page.getByRole('dialog', { name: 'Welcome to the site editor' });
  if (await welcome.isVisible()) await welcome.getByRole('button', { name: 'Get started' }).click();
  return page.frameLocator('iframe[name="editor-canvas"]');
}

test('editor persistence: first Tool Card survives save and reload independently', async ({ page }) => {
  const canvas = await openEditor(page);
  const first = canvas.locator('[data-type="custom-blocks/tool-card"]').first();
  await expect(first).toBeVisible();
  await first.click();
  const title = `isolated-title-${Date.now()}`;
  const description = `isolated-description-${Date.now()}`;
  await first.getByRole('textbox', { name: 'Tool name' }).fill(title);
  await first.getByRole('textbox', { name: 'Description' }).fill(description);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();

  await page.reload();
  const reloaded = page.frameLocator('iframe[name="editor-canvas"]').locator('[data-type="custom-blocks/tool-card"]');
  await expect(reloaded.first().getByRole('textbox', { name: 'Tool name' })).toHaveValue(title);
  await expect(reloaded.first().getByRole('textbox', { name: 'Description' })).toHaveValue(description);
  await expect(reloaded.nth(1).getByRole('textbox', { name: 'Tool name' })).toHaveValue('tmux');

  await page.goto('/');
  const cards = page.locator('.terminal-tool-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.first().getByRole('button')).toContainText(title);
  await expect(cards.nth(1).getByRole('button')).toContainText('tmux');
  await cards.first().getByRole('button').click();
  await expect(cards.first().locator('p')).toHaveText(description);
  await expect(cards.nth(1).getByRole('button')).toHaveAttribute('aria-expanded', 'false');
});

test('editor persistence: native Query Loop count survives save and reload', async ({ page }) => {
  const canvas = await openEditor(page);
  await canvas.locator('[data-type="core/query"]').click();
  await page.getByRole('button', { name: 'Select parent block: Query Loop' }).click();
  const count = page.getByRole('spinbutton', { name: 'Items per Page' });
  await expect(count).toBeVisible();
  const original = Number(await count.inputValue());
  expect(Number.isInteger(original) && original > 0).toBe(true);
  const changed = original === 2 ? 3 : 2;
  await count.fill(String(changed));
  await count.blur();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
  await page.reload();
  await page.frameLocator('iframe[name="editor-canvas"]').locator('[data-type="core/query"]').click();
  await page.getByRole('button', { name: 'Select parent block: Query Loop' }).click();
  await expect(page.getByRole('spinbutton', { name: 'Items per Page' })).toHaveValue(String(changed));
});
