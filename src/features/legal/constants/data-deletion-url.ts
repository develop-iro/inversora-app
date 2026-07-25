/** Default public URL for the Play Console / RGPD data deletion instructions. */
const DEFAULT_DATA_DELETION_URL = 'https://inversora--inversora.expo.app/eliminacion.html';

/**
 * Resolves the public data deletion instructions URL for store metadata and in-app links.
 *
 * Override with `EXPO_PUBLIC_DATA_DELETION_URL` when using a custom domain.
 */
export function getDataDeletionUrl(): string {
  const configured = process.env.EXPO_PUBLIC_DATA_DELETION_URL?.trim();

  if (configured && configured.length > 0) {
    return configured;
  }

  return DEFAULT_DATA_DELETION_URL;
}
