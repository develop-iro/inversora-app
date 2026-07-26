import type { ComponentType } from 'react';
import { Platform } from 'react-native';

import { getAppEnvironment } from '@/core/config/app-environment';
import {
  buildObserveConfigureOptions,
  shouldEnableObserve,
  type ObserveConfigureOptions,
} from '@/core/observability/expo-observe-config';

type ObserveModuleApi = {
  readonly Observe: {
    configure: (config: ObserveConfigureOptions) => void;
    markInteractive: () => void;
  };
  readonly ObserveRoot: {
    wrap: <P extends Record<string, unknown>>(
      Component: ComponentType<P>,
    ) => ComponentType<P>;
  };
};

let isObserveInitialized = false;

export {
  buildObserveConfigureOptions,
  shouldEnableObserve,
} from '@/core/observability/expo-observe-config';

/**
 * Initializes EAS Observe before the root layout mounts.
 *
 * Must run at module scope (or before first paint) so the Expo Router
 * integration is enabled before screens mount.
 *
 * @param platform - Optional platform override for tests.
 */
export function initObserve(platform: string = Platform.OS): void {
  if (isObserveInitialized || !shouldEnableObserve(platform)) {
    return;
  }

  const observe = loadObserveModule();

  if (observe === null) {
    return;
  }

  observe.Observe.configure(buildObserveConfigureOptions(getAppEnvironment()));
  isObserveInitialized = true;
}

/**
 * Wraps the root layout with `ObserveRoot` on native platforms.
 *
 * @param Component - Root layout component.
 * @param platform - Optional platform override for tests.
 */
export function wrapWithObserveRoot<P extends object>(
  Component: ComponentType<P>,
  platform: string = Platform.OS,
): ComponentType<P> {
  if (!shouldEnableObserve(platform)) {
    return Component;
  }

  const observe = loadObserveModule();

  if (observe === null) {
    return Component;
  }

  return observe.ObserveRoot.wrap(
    Component as ComponentType<Record<string, unknown>>,
  ) as ComponentType<P>;
}

/**
 * Marks the app interactive for EAS Observe TTI once the launch splash ends.
 *
 * Safe to call multiple times; only the first call per launch is recorded.
 *
 * @param platform - Optional platform override for tests.
 */
export function markAppInteractive(platform: string = Platform.OS): void {
  if (!shouldEnableObserve(platform)) {
    return;
  }

  const observe = loadObserveModule();

  if (observe === null) {
    return;
  }

  observe.Observe.markInteractive();
}

/**
 * Resets Observe initialization state (unit tests only).
 */
export function resetObserveForTests(): void {
  isObserveInitialized = false;
}

function loadObserveModule(): ObserveModuleApi | null {
  try {
    // Lazy-load so web/tests without the native module do not touch it at import time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-observe') as ObserveModuleApi;
  } catch {
    return null;
  }
}
