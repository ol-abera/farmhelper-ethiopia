import { test, expect } from '@playwright/test';

test('coordinator dashboard loads', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input').first().fill('coordinator@trackbridge.demo');
  await page.locator('input[type=password]').fill('TrackBridge!2026');
  await page.getByRole('button', { name: 'Enter' }).click();
  await expect(page).toHaveURL(/dashboard/);
});
