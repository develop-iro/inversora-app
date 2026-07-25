export type ClearLocalUserDataDependencies = {
  clearFavorites: () => Promise<void>;
  clearEducationalProfile: () => Promise<void>;
  clearCompareSelection: () => Promise<void>;
  clearInitialProfileDismissed: () => Promise<void>;
  clearCurriculumProgress: () => Promise<void>;
  clearDeviceIdentity: () => Promise<void>;
  clearAnalyticsSession: () => Promise<void>;
};

/**
 * Creates a pure local wipe orchestrator for anonymous installation data.
 *
 * @param deps - Store clear operations (injected for tests).
 */
export function createClearLocalUserData(deps: ClearLocalUserDataDependencies) {
  return async function clearLocalUserData(): Promise<void> {
    await Promise.all([
      deps.clearFavorites(),
      deps.clearEducationalProfile(),
      deps.clearCompareSelection(),
      deps.clearInitialProfileDismissed(),
      deps.clearCurriculumProgress(),
      deps.clearAnalyticsSession(),
    ]);
    await deps.clearDeviceIdentity();
  };
}
