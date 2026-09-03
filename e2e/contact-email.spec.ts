import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test.beforeEach(async ({ page }) => {
  await page.goto('/?lang=es');
  await page.locator('#contact').scrollIntoViewIfNeeded();
});

test('shows the email trigger alongside LinkedIn and GitHub', async ({ page }) => {
  await expect(page.locator('#contact-linkedin')).toBeVisible();
  await expect(page.locator('#contact-github')).toBeVisible();
  await expect(page.locator('#contact-email')).toBeVisible();
});

test('opens and closes the contact modal', async ({ page }) => {
  const modal = page.locator('[data-contact-modal]');

  await expect(modal).toBeHidden();

  await page.locator('#contact-email').click();
  await expect(modal).toBeVisible();
  await expect(page.getByRole('dialog')).toBeVisible();

  // Close via the close button
  await page.locator('[data-contact-modal-close]').first().click();
  await expect(modal).toBeHidden();
});

test('submits the form to /api/email/send', async ({ page }) => {
  await page.locator('#contact-email').click();

  const subjectInput = page.locator('[data-contact-email-subject]');
  const messageInput = page.locator('[data-contact-email-message]');

  await expect(subjectInput).toBeVisible();
  await expect(messageInput).toBeVisible();

  await subjectInput.fill('Test subject');
  await messageInput.fill('Test message body');

  let requestBody: unknown;
  page.on('request', (req) => {
    if (req.url().includes('/api/email/send') && req.method() === 'POST') {
      requestBody = req.postDataJSON();
    }
  });

  await page.locator('[data-contact-email-submit]').click();

  await expect(page.locator('[data-contact-modal-status]')).not.toHaveText('');

  // The request body must carry subject and message to the endpoint.
  expect(requestBody).toEqual({ subject: 'Test subject', message: 'Test message body' });
});
