import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';

import {
  resolveAnalyticsRouteProperties,
  resolveAnalyticsSurface,
} from '@/core/analytics/analytics-route-resolution';
import { trackEvent } from '@/core/analytics/track-event';

export { resolveAnalyticsRouteProperties, resolveAnalyticsSurface } from '@/core/analytics/analytics-route-resolution';

/**
 * Emits `screen_view` when the active Expo Router pathname changes.
 */
export function useAnalyticsScreen(): void {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastTrackedPathRef.current) {
      return;
    }

    lastTrackedPathRef.current = pathname;

    const routeProperties = resolveAnalyticsRouteProperties(pathname);

    void trackEvent('screen_view', resolveAnalyticsSurface(pathname), {
      pathname,
      ...(routeProperties ?? {}),
    });
  }, [pathname]);
}
