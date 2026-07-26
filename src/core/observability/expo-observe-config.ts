/** Observe `configure()` payload used by the native EAS Observe adapter. */
export type ObserveConfigureOptions = {
  readonly environment: string;
  readonly dispatchingEnabled: boolean;
  readonly integrations: {
    readonly 'expo-router': {
      readonly filteredParams: readonly string[];
    };
  };
};

/**
 * Returns true when EAS Observe should run on the given platform.
 *
 * Web builds must stay a no-op: `expo-observe` is native-first and web hosting
 * must not depend on the native module lifecycle.
 *
 * @param platform - React Native platform name (`ios` | `android` | `web` | …).
 */
export function shouldEnableObserve(platform: string): boolean {
  return platform === 'ios' || platform === 'android';
}

/**
 * Builds the Observe `configure()` payload for the active app environment.
 *
 * Filters `isin` from Expo Router navigation metrics so fund identifiers are
 * not exported as resolved URL params.
 *
 * @param environment - Active Inversora environment label.
 */
export function buildObserveConfigureOptions(
  environment: string,
): ObserveConfigureOptions {
  return {
    environment,
    dispatchingEnabled: true,
    integrations: {
      'expo-router': {
        filteredParams: ['isin'],
      },
    },
  };
}
