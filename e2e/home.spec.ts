import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('renders all portfolio sections in order', async ({ page }) => {
  await page.goto('/?lang=es');

  await expect(page).toHaveTitle(/Diego Betancourt/);

  const headings = ['Acerca de Mí', 'Experiencia', 'Proyectos', 'Hoja de Vida', 'Contacto'];
  for (const heading of headings) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }

  const sections = page.locator('main > section[id]');
  await expect(sections).toHaveCount(5);

  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('#experience')).toBeVisible();
  await expect(page.locator('#projects')).toBeVisible();
  await expect(page.locator('#cv')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
});

test('shows the desktop navigation sidebar with all links', async ({ page }) => {
  await page.goto('/?lang=es');

  const nav = page.locator('nav');
  await expect(nav).toBeVisible();

  const labels = ['Acerca de Mí', 'Experiencia', 'Proyectos', 'Hoja de Vida', 'Contacto', 'Blog'];
  for (const label of labels) {
    await expect(page.getByRole('link', { name: label })).toBeVisible();
  }

  await expect(page.getByRole('link', { name: 'Proyectos' })).toHaveAttribute(
    'href',
    '/?lang=es#projects'
  );
});

test('highlights the active section on scroll (scroll spy)', async ({ page }) => {
  await page.goto('/?lang=es');

  const experienceLink = page.locator('.nav-link[data-section="experience"]');
  await expect(experienceLink).not.toHaveClass(/text-blue-600/);

  await page.locator('#experience').scrollIntoViewIfNeeded();
  await expect(experienceLink).toHaveClass(/text-blue-600/);
});
