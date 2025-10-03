import { test, expect } from '@playwright/test';

test('should list first 10 football article titles from hotnews.ro', async ({ page }) => {
  await page.goto('https://hotnews.ro/');

  // Hover over the "Sport" menu to reveal the submenu.
  // We use `first()` because there might be other links with the name "Sport" on the page.
  await page.getByRole('link', { name: 'Sport' }).first().hover();

  // Click on the "Fotbal" submenu link.
  // We use `exact: true` to avoid matching other links that might contain "Fotbal".
  await page.getByRole('link', { name: 'Fotbal', exact: true }).click();

  // Wait for the navigation to complete and verify the URL.
  await expect(page).toHaveURL(/\/sport\/fotbal/);

  // Get all article titles. Titles are typically in `<h2>` tags with a link.
  const articleLinks = page.locator('h2 > a');

  // Wait for the articles to be loaded.
  await expect(articleLinks.first()).toBeVisible();

  const count = await articleLinks.count();

  // Get the text of the first 10 articles.
  const titles = [];
  for (let i = 0; i < 10 && i < count; i++) {
    titles.push(await articleLinks.nth(i).innerText());
  }

  console.log('First 10 article titles on hotnews.ro/sport/fotbal:');
  titles.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });

  // Assert that we have at least 10 articles.
  expect(titles.length).toBeGreaterThanOrEqual(10);
});