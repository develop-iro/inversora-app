import type { AnalyticsEventProperties } from '@/core/analytics/analytics-event-names';

/**
 * Maps an Expo Router pathname to a stable analytics surface identifier.
 *
 * @param pathname - Current pathname from `usePathname`.
 */
export function resolveAnalyticsSurface(pathname: string): string {
  if (pathname === '/' || pathname === '') {
    return 'home';
  }

  if (pathname === '/learn') {
    return 'learn_questionnaire';
  }

  if (pathname === '/legal') {
    return 'legal';
  }

  if (pathname === '/feedback') {
    return 'feedback';
  }

  if (pathname === '/funds') {
    return 'funds_catalog';
  }

  if (pathname.startsWith('/funds/')) {
    return 'fund_detail';
  }

  if (pathname === '/compare') {
    return 'compare';
  }

  if (pathname === '/favorites') {
    return 'favorites';
  }

  if (pathname === '/calculator') {
    return 'calculator';
  }

  return pathname.replace(/^\//, '').replace(/\//g, '_') || 'unknown';
}

/**
 * Extracts non-PII route properties for analytics from the current pathname.
 *
 * @param pathname - Current pathname from `usePathname`.
 */
export function resolveAnalyticsRouteProperties(
  pathname: string,
): AnalyticsEventProperties | undefined {
  const fundDetailMatch = /^\/funds\/([^/]+)$/.exec(pathname);

  if (fundDetailMatch) {
    return { isin: fundDetailMatch[1].toUpperCase() };
  }

  return undefined;
}
