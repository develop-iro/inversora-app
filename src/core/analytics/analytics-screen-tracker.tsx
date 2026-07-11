import { useAnalyticsScreen } from '@/core/analytics/use-analytics-screen';

/**
 * Mounts global screen-view analytics for the active Expo Router route.
 */
export function AnalyticsScreenTracker() {
  useAnalyticsScreen();
  return null;
}
