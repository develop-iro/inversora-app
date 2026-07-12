const BLOCKED_PROTOCOLS = new Set(['javascript:', 'data:', 'file:', 'blob:']);

const ALLOWED_HOSTS = new Set([
  'inversora.educa',
  'www.inversora.educa',
  'inversora.expo.app',
  'inversora--inversora.expo.app',
  'cdn.brandfetch.io',
  'www.cnmv.es',
  'www.ecb.europa.eu',
  'www.esma.europa.eu',
  'www.investopedia.com',
  'www.marketwatch.com',
]);

const ALLOWED_REMOTE_IMAGE_HOSTS = new Set(['cdn.brandfetch.io']);

/**
 * Returns whether an external URL is safe to open in the system browser.
 *
 * @param rawUrl - URL provided by API content or deep links.
 */
export function isSafeExternalUrl(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();

  if (trimmed.length === 0) {
    return false;
  }

  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:') {
    return false;
  }

  if (BLOCKED_PROTOCOLS.has(parsed.protocol)) {
    return false;
  }

  if (parsed.username.length > 0 || parsed.password.length > 0) {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();

  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
    return false;
  }

  return ALLOWED_HOSTS.has(hostname);
}

/**
 * Returns whether an HTTPS URL from a trusted API source is safe to open.
 * Unlike {@link isSafeExternalUrl}, this does not restrict hostnames because
 * market-news publishers vary (FMP feed).
 *
 * @param rawUrl - Absolute HTTPS URL returned by `GET /news`.
 */
export function isSafeHttpsUrl(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();

  if (trimmed.length === 0) {
    return false;
  }

  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:') {
    return false;
  }

  if (BLOCKED_PROTOCOLS.has(parsed.protocol)) {
    return false;
  }

  if (parsed.username.length > 0 || parsed.password.length > 0) {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();

  if (hostname.length === 0) {
    return false;
  }

  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
    return false;
  }

  if (hostname === 'localhost' || hostname.endsWith('.local')) {
    return false;
  }

  return true;
}

/**
 * Returns whether a remote image URL can be rendered by the app.
 *
 * @param rawUrl - Absolute image URL returned by API content.
 */
export function isSafeRemoteImageUrl(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();

  if (trimmed.length === 0) {
    return false;
  }

  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:') {
    return false;
  }

  if (parsed.username.length > 0 || parsed.password.length > 0) {
    return false;
  }

  return ALLOWED_REMOTE_IMAGE_HOSTS.has(parsed.hostname.toLowerCase());
}
