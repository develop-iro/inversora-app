import { useEffect, useState } from 'react';

import {
  initialProfileOnboardingStore,
  shouldUseInitialProfileGate,
} from '@/core/storage/initial-profile-onboarding-store';
import {
  STORAGE_READ_TIMEOUT_MS,
  withStorageTimeout,
} from '@/core/storage/with-storage-timeout';

type UseInitialProfileDismissedResult = {
  /** True when the user skipped the native initial profiling gate. Null while loading on native. */
  isDismissed: boolean | null;
  isLoading: boolean;
};

/**
 * Reads whether the user dismissed the native initial profiling questionnaire.
 *
 * Storage failures degrade to `false` so the native gate can still redirect
 * first-time users to `/learn?mode=initial`.
 */
export function useInitialProfileDismissed(): UseInitialProfileDismissedResult {
  const useGate = shouldUseInitialProfileGate();
  const [isDismissed, setIsDismissed] = useState<boolean | null>(() =>
    useGate ? null : false,
  );

  useEffect(() => {
    if (!useGate) {
      return;
    }

    let cancelled = false;

    void withStorageTimeout(
      initialProfileOnboardingStore.getDismissed(),
      STORAGE_READ_TIMEOUT_MS,
      false,
    )
      .then((dismissed) => {
        if (!cancelled) {
          setIsDismissed(dismissed);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsDismissed(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [useGate]);

  return {
    isDismissed,
    isLoading: useGate && isDismissed === null,
  };
}
