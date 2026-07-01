import { test, expect } from '@playwright/test';
import { mockApi } from './support/apiMocks';

test.describe('Dashboard — golden path', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      console.log(`[e2e:browser] ${msg.type()}: ${msg.text()}`);
    });
    await mockApi(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => console.log('[e2e:dashboard] page ready'));
  });

  test('shows KPI cards for revenue, orders, and users', async ({ page }) => {
    await page.evaluate(() => console.log('[e2e:dashboard] step: verify KPI cards'));
    await expect(page.getByText('Total Revenue')).toBeVisible();
    await expect(page.getByText('Total Orders')).toBeVisible();
    await expect(page.getByText('Active Users')).toBeVisible();
  });

  test('switching date range updates KPI metric values', async ({ page }) => {
    // Capture current value at default 30D range
    await page.evaluate(() => console.log('[e2e:dashboard] step: capture 30D revenue'));
    const value30d = await page.locator('p.text-2xl').first().textContent();

    // Switch to 7D — significantly less data
    await page.evaluate(() => console.log('[e2e:dashboard] step: switch to 7D'));
    await page.getByRole('button', { name: '7D' }).click();
    const value7d = await page.locator('p.text-2xl').first().textContent();

    expect(value30d).not.toBe(value7d);
  });

  test('theme toggle switches dark/light class on <html>', async ({ page }) => {
    await page.evaluate(() => console.log('[e2e:dashboard] step: verify initial dark mode'));
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.evaluate(() => console.log('[e2e:dashboard] step: switch to light mode'));
    await page.getByLabel('Switch to light mode').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await page.evaluate(() => console.log('[e2e:dashboard] step: switch back to dark mode'));
    await page.getByLabel('Switch to dark mode').click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('navigating to Orders shows the orders table', async ({ page }) => {
    await page.evaluate(() => console.log('[e2e:dashboard] step: navigate to Orders'));
    await page.getByRole('link', { name: 'Orders' }).click();
    await expect(page).toHaveURL('/orders');
    await page.evaluate(() => console.log('[e2e:dashboard] step: verify orders page loaded'));
    await expect(page.getByText('All customer transactions')).toBeVisible();
  });

  test('navigating to Analytics renders the analytics page', async ({ page }) => {
    await page.evaluate(() => console.log('[e2e:dashboard] step: navigate to Analytics'));
    await page.getByRole('link', { name: 'Analytics' }).click();
    await expect(page).toHaveURL('/analytics');
    await page.evaluate(() => console.log('[e2e:dashboard] step: verify analytics heading'));
    await expect(page.getByRole('heading', { name: 'Analytics' }).first()).toBeVisible();
  });
});
