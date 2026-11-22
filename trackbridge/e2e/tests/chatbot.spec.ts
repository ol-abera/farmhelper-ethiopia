import { test, expect } from '@playwright/test';

test('FAQ panel opens', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input').first().fill('student@trackbridge.demo');
  await page.locator('input[type=password]').fill('TrackBridge!2026');
  await page.getByRole('button', { name: 'Enter' }).click();
  await page.getByRole('button', { name: /English FAQ/ }).click();
  await expect(page.getByText(/FAQ assistant/)).toBeVisible();
});
