import { Platform } from 'react-native';

import {
  createInitialProfileOnboardingStore,
  shouldUseInitialProfileGateForOs,
} from '@/core/storage/initial-profile-onboarding-store.factory';
import { createSecureKeyValueStoragePort } from '@/core/storage/secure-key-value-storage-port';

/**
 * Returns whether the initial profile onboarding gate applies on this platform.
 *
 * Policy (see docs/product/problem-statement.md §5.2.1):
 * - iOS / Android: mandatory profiling questionnaire on first launch, with explicit skip.
 * - Web: no gate; education is invited via home CTAs and banners.
 */
export function shouldUseInitialProfileGate(): boolean {
  return shouldUseInitialProfileGateForOs(Platform.OS);
}

export {
  createInitialProfileOnboardingStore,
  shouldUseInitialProfileGateForOs,
} from '@/core/storage/initial-profile-onboarding-store.factory';

const defaultInitialProfileOnboardingStore = createInitialProfileOnboardingStore({
  storage: createSecureKeyValueStoragePort(),
  platformOs: Platform.OS,
});

export const initialProfileOnboardingStore = {
  getDismissed: () => defaultInitialProfileOnboardingStore.getDismissed(),
  setDismissed: () => defaultInitialProfileOnboardingStore.setDismissed(),
  clearDismissed: () => defaultInitialProfileOnboardingStore.clearDismissed(),
};
