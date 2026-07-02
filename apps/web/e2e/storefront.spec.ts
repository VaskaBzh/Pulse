import { test, expect } from '@playwright/test';

test.describe('Storefront — notifications popover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('bell click opens notifications popover with items', async ({ page }) => {
    await page.getByLabel('Notifications').click();
    await expect(page.getByText('Notifications')).toBeVisible();
    await expect(page.getByText('New order received')).toBeVisible();
    await expect(page.getByText('New user signed up')).toBeVisible();
    await expect(page.getByText('Mark all read')).toBeVisible();
  });

  test('clicking outside closes notifications popover', async ({ page }) => {
    await page.getByLabel('Notifications').click();
    await expect(page.getByText('New order received')).toBeVisible();
    await page.locator('header').click({ position: { x: 10, y: 10 } });
    await expect(page.getByText('New order received')).not.toBeVisible();
  });
});

test.describe('Storefront — profile dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('avatar click opens profile dropdown with menu items', async ({ page }) => {
    await page.getByText('Alex Johnson').click();
    await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
  });

  test('clicking Settings navigates to /settings', async ({ page }) => {
    await page.getByText('Alex Johnson').click();
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/settings/);
  });
});

test.describe('Storefront — mobile viewport 375px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('no horizontal page scroll', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('sidebar is off-screen by default', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('hamburger opens sidebar overlay', async ({ page }) => {
    await page.getByLabel('Toggle sidebar').click();
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/translate-x-0/);
  });

  test('clicking backdrop closes sidebar', async ({ page }) => {
    await page.getByLabel('Toggle sidebar').click();
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/translate-x-0/);
    const backdrop = page.locator('div[class*="bg-black"]');
    await backdrop.click({ position: { x: 350, y: 400 }, force: true });
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });
});

test.describe('Storefront — tablet viewport 768px', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('no horizontal page scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
