import { getAppEnvironmentConfig } from '@/core/config/app-environment';
import { assertTransportSecurityConfigured } from '@/core/api/ssl-pinning';

/**
 * Resolves the Inversora API base URL for HTTP clients.
 *
 * Configure with `EXPO_PUBLIC_API_URL` (e.g. `http://10.0.2.2:3000` on Android emulator).
 * In `ei` mode no API calls are made and this returns an empty string.
 */
export function getApiBaseUrl(): string {
  const apiBaseUrl = getAppEnvironmentConfig().apiBaseUrl;
  assertTransportSecurityConfigured(apiBaseUrl);
  return apiBaseUrl;
}
