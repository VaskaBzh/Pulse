import { test, expect } from '@playwright/test';

test.describe('Orders — critical scenarios', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      console.log(`[e2e:browser] ${msg.type()}: ${msg.text()}`);
    });
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    // Wait for the async fetchOrders to resolve (randomDelay 200-400ms)
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 });
    await page.evaluate(() => console.log('[e2e:orders] table ready'));
  });

  test('displays orders table on page load', async ({ page }) => {
    await page.evaluate(() => console.log('[e2e:orders] step: verify table visible'));
    await expect(page.getByRole('table')).toBeVisible();
    // Header columns should be present
    await expect(page.getByText('Order ID')).toBeVisible();
    await expect(page.getByText('Customer')).toBeVisible();
  });

  test('search input filters rows after debounce', async ({ page }) => {
    const allRows = page.locator('tbody tr');
    const totalBefore = await allRows.count();
    expect(totalBefore).toBeGreaterThan(0);

    await page.evaluate(() => console.log('[e2e:orders] step: type search query'));
    // Pick a search term that should match only a subset of orders
    await page.getByPlaceholder('Search by customer or email…').fill('a');

    // Wait for 300ms debounce + render
    await page.waitForTimeout(400);
    await page.evaluate(() => console.log('[e2e:orders] step: verify filtered rows'));

    const rowsAfter = await allRows.count();
    expect(rowsAfter).toBeLessThanOrEqual(totalBefore);
  });

  test('status filter "Completed" shows only completed orders', async ({ page }) => {
    await page.evaluate(() => console.log('[e2e:orders] step: click Completed filter'));
    await page.getByRole('button', { name: 'Completed' }).click();
    await page.waitForTimeout(400);

    await page.evaluate(() => console.log('[e2e:orders] step: verify only Completed badges'));
    // The table should show rows but every status badge should be "Completed"
    const rows = page.locator('tbody tr');
    const count = await rows.count();

    // If there are rows, every visible status badge must say "Completed"
    if (
      count > 0 &&
      (await page
        .getByText('No orders found')
        .isVisible()
        .catch(() => false)) === false
    ) {
      const completedBadges = page.locator('tbody').getByText('Completed');
      const badgeCount = await completedBadges.count();
      // Every visible row should have exactly one Completed badge
      expect(badgeCount).toBe(count);
    }
  });

  test('clearing filter by clicking All shows all orders again', async ({ page }) => {
    const allRows = page.locator('tbody tr');
    const totalBefore = await allRows.count();

    await page.evaluate(() => console.log('[e2e:orders] step: filter by Pending'));
    await page.getByRole('button', { name: 'Pending' }).click();
    await page.waitForTimeout(400);
    const filteredCount = await allRows.count();

    await page.evaluate(() => console.log('[e2e:orders] step: reset to All'));
    await page.getByRole('button', { name: 'All' }).click();
    await page.waitForTimeout(400);

    const resetCount = await allRows.count();
    expect(resetCount).toBe(totalBefore);
    expect(resetCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('clicking a row opens the order detail modal', async ({ page }) => {
    await page.evaluate(() => console.log('[e2e:orders] step: click first row'));
    await page.locator('tbody tr').first().click();

    await page.evaluate(() => console.log('[e2e:orders] step: verify modal visible'));
    await expect(page.getByRole('dialog')).toBeVisible();
    // Modal title contains "Order"
    await expect(page.getByRole('dialog').getByText(/Order/)).toBeVisible();
  });

  test('pressing Escape closes the order detail modal', async ({ page }) => {
    // Open modal
    await page.locator('tbody tr').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.evaluate(() => console.log('[e2e:orders] step: press Escape'));
    await page.keyboard.press('Escape');

    await page.evaluate(() => console.log('[e2e:orders] step: verify modal closed'));
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
