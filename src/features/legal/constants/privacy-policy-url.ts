/** Default public URL for the privacy policy (EAS Hosting production alias). */
const DEFAULT_PRIVACY_POLICY_URL =
  'https://inversora--inversora.expo.app/privacidad.html';

/**
 * Resolves the public privacy policy URL for store metadata and in-app links.
 *
 * Override with `EXPO_PUBLIC_PRIVACY_POLICY_URL` when using a custom domain
 * (for example `https://www.inversora.educa/privacidad.html`).
 */
export function getPrivacyPolicyUrl(): string {
  const configured = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL?.trim();

  if (configured && configured.length > 0) {
    return configured;
  }

  return DEFAULT_PRIVACY_POLICY_URL;
}
