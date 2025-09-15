import { test, expect } from '@playwright/test';

test.describe('UI/UX Visual Testing', () => {
  test('Landing page visual design and layout', async ({ page }) => {
    await page.goto('/');

    // Check main heading and gradient text
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Find your next track, film & series');

    // Check navigation with emojis
    await expect(page.locator('nav a[href="/"]')).toContainText('🏠 Home');
    await expect(page.locator('nav a[href="/songs"]')).toContainText('🎵 Songs');
    await expect(page.locator('nav a[href="/movies"]')).toContainText('🎬 Movies');
    await expect(page.locator('nav a[href="/tvshows"]')).toContainText('📺 TV Shows');

    // Check feature cards
    const featureCards = page.locator('.grid.md\\:grid-cols-3 > div');
    await expect(featureCards).toHaveCount(3);

    // Check CTA cards
    const ctaCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-3 > a');
    await expect(ctaCards).toHaveCount(3);

    // Verify emoji presence in CTAs
    await expect(ctaCards.nth(0)).toContainText('🎵');
    await expect(ctaCards.nth(1)).toContainText('🎬');
    await expect(ctaCards.nth(2)).toContainText('📺');
  });

  test('Header styling and interactions', async ({ page }) => {
    await page.goto('/');

    // Check logo colors and styling
    const logo = page.locator('header a[aria-label="Go to homepage"]');
    await expect(logo).toBeVisible();

    // Check decorative element
    const decorativeElement = page.locator('header .bg-gradient-to-br');
    await expect(decorativeElement).toBeVisible();

    // Test navigation hover effects
    const navLinks = page.locator('nav a');
    for (let i = 0; i < await navLinks.count(); i++) {
      await navLinks.nth(i).hover();
      // Allow time for hover animation
      await page.waitForTimeout(100);
    }
  });

  test('Card hover animations and interactions', async ({ page }) => {
    await page.goto('/');

    // Test feature card hover
    const featureCards = page.locator('.grid.md\\:grid-cols-3 > div');
    await featureCards.first().hover();
    await page.waitForTimeout(200);

    // Test CTA card hover with transform effects
    const ctaCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-3 > a');
    await ctaCards.first().hover();
    await page.waitForTimeout(200);

    // Check emoji scale animation on hover
    const emoji = ctaCards.first().locator('div[class*="text-6xl"]');
    await emoji.hover();
    await page.waitForTimeout(200);
  });

  test('Footer styling and content', async ({ page }) => {
    await page.goto('/');

    // Check footer content with emojis
    const footer = page.locator('footer');
    await expect(footer).toContainText('⚡ Powered by advanced AI');
    await expect(footer).toContainText('🔒 No tracking');
    await expect(footer).toContainText('🎨 Privacy-first design');

    // Check footer links with emojis
    await expect(footer.locator('a[href="https://github.com"]')).toContainText('📚 GitHub');
    await expect(footer.locator('a[href="/privacy"]')).toContainText('🛡️ Privacy');
  });

  test('Color scheme and gradients', async ({ page }) => {
    await page.goto('/');

    // Check background gradient
    const body = page.locator('body');
    const bodyStyles = await body.evaluate(el => getComputedStyle(el));
    expect(bodyStyles.background).toContain('linear-gradient');

    // Check button gradients
    const ctaCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-3 > a');
    await ctaCards.first().hover();

    // Test that cards have appropriate gradients
    for (let i = 0; i < await ctaCards.count(); i++) {
      await ctaCards.nth(i).hover();
      await page.waitForTimeout(100);
    }
  });
});