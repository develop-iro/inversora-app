import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiPost } from '@/core/api/client';
import { isDevDiagnosticsEnabled, isProductionRelease } from '@/core/config/app-environment';

const ANALYTICS_SESSION_KEY = '@inversora/analytics/session-id';

export type AnalyticsEventName =
  | 'screen_view'
  | 'fund_opened'
  | 'compare_completed'
  | 'learn_completed'
  | 'favorite_toggled'
  | 'calculator_run'
  | 'perf_mark';

export type AnalyticsEventPayload = {
  readonly event: AnalyticsEventName;
  readonly surface: string;
  readonly timestamp: string;
  readonly sessionId: string;
  readonly properties?: Readonly<Record<string, string | number | boolean>>;
};

async function resolveSessionId(): Promise<string> {
  const existing = await AsyncStorage.getItem(ANALYTICS_SESSION_KEY);

  if (existing) {
    return existing;
  }

  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
  return sessionId;
}

/**
 * Tracks an anonymous analytics event (HU-41).
 *
 * @param event - Event name.
 * @param surface - UI surface identifier.
 * @param properties - Optional non-PII metadata.
 */
export async function trackEvent(
  event: AnalyticsEventName,
  surface: string,
  properties?: Readonly<Record<string, string | number | boolean>>,
): Promise<void> {
  const sessionId = await resolveSessionId();
  const payload: AnalyticsEventPayload = {
    event,
    surface,
    timestamp: new Date().toISOString(),
    sessionId,
    properties,
  };

  if (isDevDiagnosticsEnabled() && !isProductionRelease()) {
    // eslint-disable-next-line no-console -- intentional local diagnostics only
    console.log('[analytics]', payload);
    return;
  }

  try {
    await apiPost({
      path: '/analytics/events',
      body: payload,
    });
  } catch {
    // Analytics must never block UX.
  }
}

/**
 * Records a performance mark for a surface (HU-42).
 *
 * @param surface - UI surface identifier.
 * @param durationMs - Measured duration in milliseconds.
 */
export function trackPerfMark(surface: string, durationMs: number): void {
  void trackEvent('perf_mark', surface, { durationMs: Math.round(durationMs) });
}
