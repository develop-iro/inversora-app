import { Platform } from 'react-native';

import { isProductionRelease } from '@/core/config/app-environment';
import { SSL_PINNED_HOSTS } from '@/core/api/ssl-pinning.constants';

export { SSL_PINNED_HOSTS } from '@/core/api/ssl-pinning.constants';

/**
 * Returns whether SSL pinning is enabled for the current build.
 */
export function isSslPinningEnabled(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }

  return (
    process.env.EXPO_PUBLIC_SSL_PINNING_ENABLED === 'true' && isProductionRelease()
  );
}

/**
 * Validates that the API host is in the transport-security allowlist before
 * production native API calls.
 *
 * Note: the Expo config plugin enforces strict transport security (ATS on iOS,
 * no cleartext traffic on Android), not SPKI certificate pinning. See
 * `plugins/with-ssl-pinning.js`.
 */
export function assertSslPinningConfigured(apiBaseUrl: string): void {
  if (!isSslPinningEnabled()) {
    return;
  }

  let hostname: string;

  try {
    hostname = new URL(apiBaseUrl).hostname.toLowerCase();
  } catch {
    throw new Error('Invalid API base URL for SSL pinning.');
  }

  if (!SSL_PINNED_HOSTS.includes(hostname as (typeof SSL_PINNED_HOSTS)[number])) {
    throw new Error(`API host ${hostname} is not covered by SSL pinning.`);
  }
}
