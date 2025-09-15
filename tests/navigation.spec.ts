import { test, expect } from '@playwright/test';

test.describe('Navigation and User Experience', () => {
  test('Navigation between pages works correctly', async ({ page }) => {
    await page.goto('/');

    // Test navigation to Songs page
    await page.click('a[href="/songs"]');
    await expect(page).toHaveURL('/songs');
    await expect(page.locator('nav a[href="/songs"]')).toHaveClass(/from-primary-400/);

    // Test navigation to Movies page
    await page.click('a[href="/movies"]');
    await expect(page).toHaveURL('/movies');
    await expect(page.locator('nav a[href="/movies"]')).toHaveClass(/from-primary-400/);

    // Test navigation to TV Shows page
    await page.click('a[href="/tvshows"]');
    await expect(page).toHaveURL('/tvshows');
    await expect(page.locator('nav a[href="/tvshows"]')).toHaveClass(/from-primary-400/);

    // Test back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('nav a[href="/"]')).toHaveClass(/from-primary-400/);
  });

  test('Mobile navigation works properly', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto('/');

    // Check mobile navigation is visible
    const mobileNav = page.locator('nav.md\\:hidden');
    await expect(mobileNav).toBeVisible();

    // Test mobile navigation links
    const mobileLinks = mobileNav.locator('a');
    await expect(mobileLinks).toHaveCount(4);

    // Test mobile navigation functionality
    await mobileLinks.filter({ hasText: '🎵 Songs' }).click();
    await expect(page).toHaveURL('/songs');
  });

  test('Logo navigation works', async ({ page }) => {
    await page.goto('/songs');

    // Click logo to go home
    await page.click('header a[aria-label="Go to homepage"]');
    await expect(page).toHaveURL('/');
  });

  test('CTA cards navigation', async ({ page }) => {
    await page.goto('/');

    // Test Songs CTA
    const songsCTA = page.locator('a[href="/songs"]').first();
    await songsCTA.click();
    await expect(page).toHaveURL('/songs');

    await page.goBack();

    // Test Movies CTA
    const moviesCTA = page.locator('a[href="/movies"]').first();
    await moviesCTA.click();
    await expect(page).toHaveURL('/movies');

    await page.goBack();

    // Test TV Shows CTA
    const tvshowsCTA = page.locator('a[href="/tvshows"]').first();
    await tvshowsCTA.click();
    await expect(page).toHaveURL('/tvshows');
  });
});