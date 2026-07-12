import { Linking } from 'react-native';

import { isSafeExternalUrl } from '@/core/security/safe-external-url';

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

  await Linking.openURL(rawUrl);
  return true;
}
