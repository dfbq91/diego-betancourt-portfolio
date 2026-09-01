import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('lists Spanish articles', async ({ page }) => {
  await page.goto('/blog?lang=es');

  await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();

  const articleLinks = page.locator('article a[href^="/blog/"]');
  await expect(articleLinks).not.toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Primeros pasos con Astro' })).toBeVisible();
});

test('lists English articles', async ({ page }) => {
  await page.goto('/blog?lang=en');

  await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Getting started with Astro' })).toBeVisible();
});

test('opens a Spanish article from the listing', async ({ page }) => {
  await page.goto('/blog?lang=es');

  await page.getByRole('link', { name: 'Primeros pasos con Astro' }).click();

  await expect(page).toHaveURL(/\/blog\//);
  await expect(page.getByText('Astro es un framework web moderno')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Volver al Blog' })).toBeVisible();
});

test('opens an English article from the listing', async ({ page }) => {
  await page.goto('/blog?lang=en');

  await page.getByRole('link', { name: 'Getting started with Astro' }).click();

  await expect(page).toHaveURL(/\/blog\//);
  await expect(page.getByText('Astro is a modern web framework')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to Blog' })).toBeVisible();
});
