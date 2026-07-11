import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import { apiPost } from '@/core/api/client';
import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from '@/core/analytics/analytics-event-names';
import {
  getAppEnvironment,
  isDevDiagnosticsEnabled,
  isProductionRelease,
} from '@/core/config/app-environment';
import { deviceIdentityStore } from '@/core/storage/device-identity-store';

const ANALYTICS_SESSION_KEY = '@inversora/analytics/session-id';

export type AnalyticsEventPayload = {
  readonly event: AnalyticsEventName;
  readonly surface: string;
  readonly timestamp: string;
  readonly sessionId: string;
  readonly deviceId?: string;
  readonly appEnv?: string;
  readonly appVersion?: string;
  readonly properties?: AnalyticsEventProperties;
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

function resolveAppVersion(): string | undefined {
  const version = Constants.expoConfig?.version?.trim();
  return version && version.length > 0 ? version : undefined;
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
  properties?: AnalyticsEventProperties,
): Promise<void> {
  const sessionId = await resolveSessionId();
  const deviceId = await deviceIdentityStore.getDeviceId();
  const payload: AnalyticsEventPayload = {
    event,
    surface,
    timestamp: new Date().toISOString(),
    sessionId,
    deviceId: deviceId ?? undefined,
    appEnv: getAppEnvironment(),
    appVersion: resolveAppVersion(),
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
