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
 * Validates that SSL pinning is configured before production native API calls.
 *
 * Runtime pinning is enforced by the Expo config plugin during EAS builds.
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
