import { Linking, Platform } from 'react-native';

import { isSafeExternalUrl, isSafeHttpsUrl } from '@/core/security/safe-external-url';

/**
 * Opens an external HTTPS URL when it passes the app allowlist.
 *
 * @param rawUrl - Absolute URL to open in the system browser.
 * @returns Whether the URL was opened.
 */
export async function openSafeExternalUrl(rawUrl: string): Promise<boolean> {
  if (!isSafeExternalUrl(rawUrl)) {
    return false;
  }

  return openValidatedHttpsUrl(rawUrl);
}

/**
 * Opens an HTTPS URL returned by trusted API feeds (for example `GET /news`).
 *
 * @param rawUrl - Absolute HTTPS URL to open in the system browser.
 * @returns Whether the URL was opened.
 */
export async function openTrustedHttpsUrl(rawUrl: string): Promise<boolean> {
  if (!isSafeHttpsUrl(rawUrl)) {
    return false;
  }

  return openValidatedHttpsUrl(rawUrl);
}

async function openValidatedHttpsUrl(rawUrl: string): Promise<boolean> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(rawUrl, '_blank', 'noopener,noreferrer');
    return true;
  }

  const canOpen = await Linking.canOpenURL(rawUrl);

  if (!canOpen) {
    return false;
  }

  await Linking.openURL(rawUrl);
  return true;
}
