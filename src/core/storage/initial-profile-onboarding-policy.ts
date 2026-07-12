/**
 * Pure onboarding gate policy helpers (testable without React Native runtime).
 */

/**
 * Returns whether the initial profile gate applies for a given platform OS id.
 *
 * @param platformOs - `Platform.OS` value (e.g. `ios`, `android`, `web`).
 */
export function shouldUseInitialProfileGateForPlatform(platformOs: string): boolean {
  return platformOs === 'ios' || platformOs === 'android';
}

/**
 * Returns whether the user may browse this route without completing initial profiling.
 *
 * @param segments - Current expo-router segment list.
 */
export function isOnboardingExemptRoute(segments: readonly string[]): boolean {
  const root = segments[0];
  return root === 'learn' || root === 'legal';
}

export type InitialProfileGateRedirectInput = {
  readonly enabled: boolean;
  readonly useGate: boolean;
  readonly isProfileLoading: boolean;
  readonly isDismissed: boolean | null;
  readonly hasProfile: boolean;
  readonly hasRedirected: boolean;
  readonly segments: readonly string[];
};

/**
 * Returns whether the client should redirect to `/learn?mode=initial`.
 *
 * @param input - Current gate evaluation context.
 */
export function shouldRedirectToInitialProfileQuestionnaire(
  input: InitialProfileGateRedirectInput,
): boolean {
  if (!input.enabled || !input.useGate) {
    return false;
  }

  if (input.isProfileLoading || input.isDismissed === null) {
    return false;
  }

  if (input.hasProfile || input.isDismissed || input.hasRedirected) {
    return false;
  }

  if (isOnboardingExemptRoute(input.segments)) {
    return false;
  }

  return true;
}
