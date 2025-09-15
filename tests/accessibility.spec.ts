import { test, expect } from '@playwright/test';

test.describe('Accessibility Testing', () => {
  test('Keyboard navigation works properly', async ({ page }) => {
    await page.goto('/');

    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Test Enter key navigation
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/');

    // Continue tabbing to other elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    // Should navigate to songs page
    await expect(page).toHaveURL('/songs');
  });

  test('Focus states are visible', async ({ page }) => {
    await page.goto('/');

    // Tab through elements and check focus
    const tabbableElements = [
      'header a[aria-label="Go to homepage"]',
      'nav a[href="/"]',
      'nav a[href="/songs"]',
      'nav a[href="/movies"]',
      'nav a[href="/tvshows"]',
    ];

    for (const selector of tabbableElements) {
      await page.focus(selector);

      // Check that element has focus ring
      const element = page.locator(selector);
      const styles = await element.evaluate(el => getComputedStyle(el));
      expect(styles.outline).toBeTruthy();
    }
  });

  test('ARIA labels and semantic HTML', async ({ page }) => {
    await page.goto('/');

    // Check navigation has proper role
    await expect(page.locator('nav[role="navigation"]')).toHaveCount(2); // Desktop + mobile

    // Check main content area
    await expect(page.locator('main[role="main"]')).toBeVisible();

    // Check footer
    await expect(page.locator('footer[role="contentinfo"]')).toBeVisible();

    // Check logo has aria-label
    await expect(page.locator('a[aria-label="Go to homepage"]')).toBeVisible();

    // Check CTA cards have button role
    const ctaCards = page.locator('div[role="button"]');
    await expect(ctaCards).toHaveCount(3);
  });

  test('Color contrast and readability', async ({ page }) => {
    await page.goto('/');

    // Check main heading is readable
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Check navigation text is readable
    const navLinks = page.locator('nav a');
    for (let i = 0; i < await navLinks.count(); i++) {
      await expect(navLinks.nth(i)).toBeVisible();
    }

    // Check footer text is readable
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Reduced motion preferences', async ({ page }) => {
    // Set prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Test that animations are reduced
    const decorativeElement = page.locator('header .animate-pulse');
    await expect(decorativeElement).toBeVisible();

    // Hover over elements to ensure they still function
    const ctaCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-3 > a');
    await ctaCards.first().hover();
  });
});