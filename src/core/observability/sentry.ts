import * as Sentry from '@sentry/react-native';

import { getAppEnvironment, isProductionRelease } from '@/core/config/app-environment';

let isSentryInitialized = false;

/**
 * Initializes Sentry when a DSN is configured for production release builds.
 */
export function initSentry(): void {
  if (isSentryInitialized) {
    return;
  }

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();

  if (!dsn || !isProductionRelease()) {
    return;
  }

  Sentry.init({
    dsn,
    environment: getAppEnvironment(),
    tracesSampleRate: 0.2,
    enableAutoSessionTracking: true,
  });

  isSentryInitialized = true;
}

/**
 * Resets Sentry initialization state (unit tests only).
 */
export function resetSentryForTests(): void {
  isSentryInitialized = false;
}
