import assert from 'node:assert/strict';
import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('visitor understands the offer and can reach signup', async ({ app, browser }) => {
  await app.open('/');
  await expect(browser.locator('h1')).toContainText('Your money,');
  await expect(browser.locator('.hero-description')).toContainText('budget');
  await expect(browser.locator('.hero-identity-note')).toContainText('In development');
  if (await browser.evaluate(() => innerWidth < 700)) {
    await browser.locator('.site-menu-button').click();
    await browser.locator('.site-dropdown-waitlist').click();
  } else {
    await browser.locator('.site-waitlist').click();
  }
  await expect(browser.locator('#waitlist-email')).toBeVisible();
  assert.equal(await browser.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
});

test('menu supports keyboard dismissal, routes, and persistent theme', async ({ app, browser }) => {
  await app.open('/');
  await browser.locator('.site-menu-button').click();
  await expect(browser.locator('#site-navigation')).toHaveAttribute('aria-hidden', 'false');
  const before = await browser.evaluate(() => document.documentElement.dataset.theme ?? '');
  await browser.locator('.appearance-toggle').click();
  const after = await browser.evaluate(() => document.documentElement.dataset.theme ?? '');
  assert.notEqual(after, before);
  await browser.locator('.site-menu-button').press('Escape');
  await expect(browser.locator('.site-menu-button')).toHaveAttribute('aria-expanded', 'false');
  assert.equal(await browser.evaluate(() => document.activeElement?.classList.contains('site-menu-button') ?? false), true);
  await browser.reload();
  assert.equal(await browser.evaluate(() => document.documentElement.dataset.theme ?? ''), after);
  await browser.locator('.site-menu-button').click();
  await browser.locator('#site-navigation a[href="/updates"]').click();
  await expect(browser.locator('h1')).toContainText('Getting a little');
  assert.equal(new URL(await browser.url()).pathname, '/updates');
  await app.open('/privacy');
  await expect(browser.locator('h1')).toContainText('Privacy');
});

test('screenshots load, previews switch with keyboard, page fits', async ({ app, browser }) => {
  await app.open('/');
  await browser.locator('#siri button').nth(1).click();
  await expect(browser.locator('#siri img[src*="shortcuts"]')).toBeVisible();
  await browser.locator('#siri button').nth(0).press('Enter');
  await expect(browser.locator('#siri img[src*="shortcut-logged"]')).toBeVisible();
  await expect(browser.locator('img[src*="insights"]')).toHaveCount(1);
  const result = await browser.evaluate(async () => {
    for (const img of Array.from(document.images)) {
      img.loading = 'eager';
      await img.decode().catch(() => {});
    }
    return { broken: Array.from(document.images).filter(i => !i.naturalWidth).map(i => i.getAttribute('src')), overflow: document.documentElement.scrollWidth > innerWidth };
  });
  assert.deepEqual(result.broken, []);
  assert.equal(result.overflow, false);
});

test('questions explain availability, price, and bank access', async ({ app, browser }) => {
  await app.open('/');
  await browser.locator('.compact-faq > .motion-question > button').click();
  for (const phrase of ['Can I download Spendy yet?', 'What can I use for free?', 'Do I need to connect my bank?']) {
    const buttons = browser.locator('.faq button');
    const index = await browser.evaluate((text) => Array.from(document.querySelectorAll('.faq button')).findIndex(b => b.textContent?.includes(text)), phrase);
    assert.ok(index >= 0);
    await buttons.nth(index).click();
    await expect(buttons.nth(index)).toHaveAttribute('aria-expanded', 'true');
  }
  await expect(browser.locator('.faq')).toContainText('beta is not open');
  await expect(browser.locator('.faq')).toContainText('does not need your bank login');
});

test('signup saves locally, ticket tears, duplicate stays successful', async ({ app, browser }) => {
  await app.open('/#waitlist');
  const email = `e2e-${Date.now()}@example.com`;
  await browser.locator('#waitlist-email').fill(email);
  await browser.locator('.consent input').check();
  await browser.locator('.email-row button').click();
  await expect(browser.locator('dialog[open]')).toBeVisible();
  await expect(browser.locator('.ticket-email')).toContainText(email);
  await browser.locator('.tear-ticket__piece--stub').press('Enter');
  await expect(browser.locator('.ticket-done')).toBeVisible();
  await browser.locator('.ticket-done').click();
  await browser.locator('.signup-success > button').click();
  await browser.locator('#waitlist-email').fill(email);
  await browser.locator('.consent input').check();
  await browser.locator('.email-row button').click();
  await expect(browser.locator('dialog[open]')).toBeVisible();
  await browser.keyboard.press('Escape');
  await expect(browser.locator('dialog[open]')).toHaveCount(0);
});

test('failed signup retains email and retries without false confirmation', async ({ app, browser }) => {
  await browser.route('**/api/waitlist', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Could not save your signup. Please try again shortly.' }) }));
  await app.open('/#waitlist');
  await browser.locator('#waitlist-email').fill('retry@example.com');
  await browser.locator('.consent input').check();
  await browser.locator('.email-row button').click();
  await expect(browser.locator('[role="alert"]')).toContainText('Please try again');
  await expect(browser.locator('dialog[open]')).toHaveCount(0);
  assert.equal(await browser.evaluate(() => (document.querySelector('#waitlist-email') as HTMLInputElement).value), 'retry@example.com');
  await browser.unroute('**/api/waitlist');
  // Retry uses an explicit success stub to keep real requests under the server rate limit.
  await browser.route('**/api/waitlist', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: "You're on the list." }) }));
  await browser.locator('.email-row button').click();
  await expect(browser.locator('dialog[open]')).toBeVisible();
  await browser.locator('.ticket-close').click();
});


test('invalid email and missing consent never submit', async ({ app, browser }) => {
  await app.open('/#waitlist');
  await browser.locator('#waitlist-email').fill('invalid');
  await browser.locator('.email-row button').click();
  assert.equal(await browser.evaluate(() => (document.querySelector('#waitlist-email') as HTMLInputElement).validity.typeMismatch), true);
  await expect(browser.locator('dialog[open]')).toHaveCount(0);
  await browser.locator('#waitlist-email').fill('consent@example.com');
  await browser.locator('.email-row button').click();
  assert.equal(await browser.evaluate(() => (document.querySelector('.consent input') as HTMLInputElement).validity.valueMissing), true);
  await expect(browser.locator('dialog[open]')).toHaveCount(0);
});
