import { Platform } from 'react-native';

import { isTransportSecurityHost } from '@/core/api/ssl-pinning.constants';
import { isProductionRelease } from '@/core/config/app-environment';

export {
  SSL_PINNED_HOSTS,
  isTransportSecurityHost,
  TRANSPORT_SECURITY_HOSTS,
} from '@/core/api/ssl-pinning.constants';

/**
 * Returns whether strict native transport security is enabled for the current build.
 */
export function isTransportSecurityHardeningEnabled(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }

  return (
    process.env.EXPO_PUBLIC_SSL_PINNING_ENABLED === 'true' && isProductionRelease()
  );
}

/** @deprecated Use isTransportSecurityHardeningEnabled. */
export const isSslPinningEnabled = isTransportSecurityHardeningEnabled;

/**
 * Validates that the API host is in the transport-security allowlist before
 * production native API calls.
 *
 * Note: the Expo config plugin enforces strict transport security (ATS on iOS,
 * no cleartext traffic on Android), not SPKI certificate pinning. See
 * `plugins/with-ssl-pinning.js`.
 */
export function assertTransportSecurityConfigured(apiBaseUrl: string): void {
  if (!isTransportSecurityHardeningEnabled()) {
    return;
  }

  let hostname: string;

  try {
    hostname = new URL(apiBaseUrl).hostname.toLowerCase();
  } catch {
    throw new Error('Invalid API base URL for transport security.');
  }

  if (!isTransportSecurityHost(hostname)) {
    throw new Error(`API host ${hostname} is not covered by transport security.`);
  }
}

/** @deprecated Use assertTransportSecurityConfigured. */
export const assertSslPinningConfigured = assertTransportSecurityConfigured;
