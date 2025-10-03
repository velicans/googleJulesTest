import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://petstore.swagger.io/');
  await expect(page).toHaveTitle(/Swagger UI/);
});