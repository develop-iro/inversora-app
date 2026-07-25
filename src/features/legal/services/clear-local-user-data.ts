import AsyncStorage from '@react-native-async-storage/async-storage';

import { compareSelectionStore } from '@/core/storage/compare-selection-store';
import { deviceIdentityStore } from '@/core/storage/device-identity-store';
import { educationalProfileStore } from '@/core/storage/educational-profile-store';
import { favoritesStore } from '@/core/storage/favorites-store';
import { initialProfileOnboardingStore } from '@/core/storage/initial-profile-onboarding-store';
import { learnCurriculumProgressStore } from '@/core/storage/learn-curriculum-progress-store';
import { createClearLocalUserData } from '@/features/legal/services/clear-local-user-data.factory';

const ANALYTICS_SESSION_KEY = '@inversora/analytics/session-id';

const defaultClearLocalUserData = createClearLocalUserData({
  clearFavorites: () => favoritesStore.clearFavorites(),
  clearEducationalProfile: () => educationalProfileStore.clearProfile(),
  clearCompareSelection: () => compareSelectionStore.clear(),
  clearInitialProfileDismissed: () => initialProfileOnboardingStore.clearDismissed(),
  clearCurriculumProgress: () => learnCurriculumProgressStore.clearProgress(),
  clearDeviceIdentity: () => deviceIdentityStore.clearDeviceIdentity(),
  clearAnalyticsSession: () => AsyncStorage.removeItem(ANALYTICS_SESSION_KEY),
});

/**
 * Clears installation-scoped local data after a successful server wipe.
 */
export async function clearLocalUserData(): Promise<void> {
  return defaultClearLocalUserData();
}

export { createClearLocalUserData } from '@/features/legal/services/clear-local-user-data.factory';
