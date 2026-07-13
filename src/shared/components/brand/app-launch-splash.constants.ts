import { palette } from '@/shared/theme/palette';

/**
 * Solid brand background shared by the native Expo splash and the in-app launch overlay.
 * Keep in sync with `expo-splash-screen` `backgroundColor` in `app.config.mjs`.
 */
export const LAUNCH_SPLASH_BACKGROUND = palette.deepOcean;

/** Wordmark shown on the branded launch splash. */
export const LAUNCH_SPLASH_WORDMARK = 'Inversora' as const;

/** Delay between each letter entrance. */
export const LAUNCH_SPLASH_LETTER_STAGGER_MS = 65;

/** Duration of a single letter entrance. */
export const LAUNCH_SPLASH_LETTER_DURATION_MS = 380;

/** Pause after the full wordmark is visible, before dismiss starts. */
export const LAUNCH_SPLASH_HOLD_MS = 380;

/**
 * Minimum splash visibility after fonts load: full letter animation plus brief hold.
 */
export function getLaunchSplashMinimumDisplayMs(): number {
  const letterCount = LAUNCH_SPLASH_WORDMARK.length;

  return (
    (letterCount - 1) * LAUNCH_SPLASH_LETTER_STAGGER_MS +
    LAUNCH_SPLASH_LETTER_DURATION_MS +
    LAUNCH_SPLASH_HOLD_MS
  );
}
