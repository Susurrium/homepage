import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('首页可访问、主题可切换且无严重无障碍问题', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle(/Susurrium/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const themeToggle = page.locator('[data-theme-toggle]');
  await themeToggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(themeToggle).toHaveAttribute('aria-pressed', 'true');

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('博客文章提供目录、更新时间容器和阅读增强控件', async ({ page }) => {
  await page.goto('./blog/');
  const firstPost = page.locator('article a[href*="/blog/"]').first();
  await expect(firstPost).toBeVisible();
  await firstPost.click();

  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('[data-reading-progress]')).toBeAttached();
  await expect(page.locator('[data-article-toc]').first()).toBeAttached();
});

test('Pagefind Component UI 能返回构建后的站内结果', async ({ page }) => {
  await page.goto('./search/');

  const searchInput = page.locator('pagefind-input input');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('Astro');
  await expect(page.locator('pagefind-results')).toContainText(/Astro/i, { timeout: 15_000 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth)
  );
});

test('不存在的路径使用自定义 404 页面', async ({ page }) => {
  const response = await page.goto('./not-a-real-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('404', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('找不到');
  await expect(page.getByRole('link', { name: '返回首页', exact: true }).last()).toBeVisible();
});

test('移动菜单支持打开、焦点进入和 Escape 关闭', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), '仅在移动端项目检查菜单交互');
  await page.goto('./');

  const toggle = page.locator('[data-mobile-menu-toggle]');
  const overlay = page.locator('[data-mobile-menu-overlay]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(overlay).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('[data-mobile-menu-link]').first()).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});
