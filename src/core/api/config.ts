const DEFAULT_API_BASE_URL = 'http://localhost:3000';

/**
 * Resolves the Inversora API base URL for HTTP clients.
 *
 * Configure with `EXPO_PUBLIC_API_URL` (e.g. `http://10.0.2.2:3000` on Android emulator).
 */
export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (configured !== undefined && configured.length > 0) {
    return configured.replace(/\/+$/, '');
  }

  return DEFAULT_API_BASE_URL;
}
