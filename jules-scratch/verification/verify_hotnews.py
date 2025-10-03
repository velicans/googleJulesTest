import re
from playwright.sync_api import sync_playwright, expect

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate directly to the football section.
        page.goto("https://hotnews.ro/c/sport/fotbal")

        # Handle the cookie consent banner by clicking the "ACCEPT TOATE" button.
        try:
            # Use a more specific and user-facing selector for the accept button.
            accept_button = page.get_by_role('button', name='ACCEPT TOATE')
            # Wait for the button to be visible and enabled before clicking.
            expect(accept_button).to_be_visible(timeout=10000)
            accept_button.click()
        except Exception as e:
            print(f"Could not find or click the cookie accept button: {e}")
            # The script will continue if the button is not found.

        # Wait for the banner to disappear.
        expect(page.get_by_role('button', name='ACCEPT TOATE')).to_be_hidden()

        # Get all article titles. Titles are typically in `<h2>` tags with a link.
        article_links = page.locator('h2 > a')

        # Wait for the articles to be loaded.
        expect(article_links.first).to_be_visible()

        # Take a screenshot.
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    main()