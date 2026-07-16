import { expect, type Page } from '@playwright/test';

/**
 * Normalizes accented text for resilient UI assertions.
 */
export function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/**
 * Asserts the page body contains the expected text, ignoring accents and case.
 */
export async function expectPageToContain(page: Page, expected: string) {
  await expect
    .poll(async () => stripAccents(await page.locator('body').innerText()).toLowerCase())
    .toContain(stripAccents(expected).toLowerCase());
}

/**
 * Navigates to an app route with a stable wait condition for Expo web.
 */
export async function gotoRoute(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}
