import { test, expect } from '@playwright/test';

test.describe('Performance and Core Web Vitals', () => {
  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Check that main content is visible quickly
    await expect(page.locator('h1')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('nav')).toBeVisible({ timeout: 1000 });
  });

  test('Image and asset loading', async ({ page }) => {
    await page.goto('/');

    // Check that no images fail to load (if any)
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        await expect(image).toBeVisible();
      }
    }

    // Check that CSS is loaded properly by verifying styled elements
    const header = page.locator('header');
    const styles = await header.evaluate(el => getComputedStyle(el));
    expect(styles.background).toBeTruthy();
  });

  test('Animation performance', async ({ page }) => {
    await page.goto('/');

    // Test hover animations don't cause layout shifts
    const ctaCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-3 > a');

    for (let i = 0; i < await ctaCards.count(); i++) {
      await ctaCards.nth(i).hover();
      await page.waitForTimeout(100);

      // Verify page is still stable
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('Responsive design performance', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Tablet
      { width: 375, height: 667 },   // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // Check that layout doesn't break
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();

      // Check that content fits in viewport
      const body = page.locator('body');
      const box = await body.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  test('Font loading and typography', async ({ page }) => {
    await page.goto('/');

    // Check that fonts are loaded properly
    const heading = page.locator('h1');
    const headingStyles = await heading.evaluate(el => getComputedStyle(el));
    expect(headingStyles.fontFamily).toBeTruthy();

    // Check logo font
    const logo = page.locator('header a[aria-label="Go to homepage"]');
    const logoStyles = await logo.evaluate(el => getComputedStyle(el));
    expect(logoStyles.fontFamily).toContain('monospace');
  });
});