import { test, expect } from '@playwright/test';
import users from '../fixtures/users.json';

for (const u of users.users) {
  test(`login as ${u.role}`, async ({ page }) => {
    await page.goto('/login');
    await page.locator('input').first().fill(u.email);
    await page.locator('input[type=password]').fill(users.password);
    await page.getByRole('button', { name: 'Enter' }).click();
    await expect(page).toHaveURL(/dashboard/);
  });
}
