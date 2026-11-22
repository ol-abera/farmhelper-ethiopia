import { test, expect } from '@playwright/test';

test('title form shows advisory banner', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input').first().fill('student@trackbridge.demo');
  await page.locator('input[type=password]').fill('TrackBridge!2026');
  await page.getByRole('button', { name: 'Enter' }).click();
  await page.goto('/projects/title');
  await expect(page.getByText(/Advisory/)).toBeVisible();
  await expect(page.getByText(/TF-IDF/)).toBeVisible();
});
