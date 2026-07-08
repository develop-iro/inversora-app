const BLOCKED_PROTOCOLS = new Set(['javascript:', 'data:', 'file:', 'blob:']);

const ALLOWED_HOSTS = new Set([
  'inversora.educa',
  'www.inversora.educa',
  'cdn.brandfetch.io',
  'www.cnmv.es',
  'www.ecb.europa.eu',
  'www.esma.europa.eu',
  'www.investopedia.com',
]);

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
