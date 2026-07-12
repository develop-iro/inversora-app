import { useEffect, useState } from 'react';

import {
  initialProfileOnboardingStore,
  shouldUseInitialProfileGate,
} from '@/core/storage/initial-profile-onboarding-store';

type UseInitialProfileDismissedResult = {
  /** True when the user skipped the native initial profiling gate. Null while loading on native. */
  isDismissed: boolean | null;
  isLoading: boolean;
};

/**
 * Reads whether the user dismissed the native initial profiling questionnaire.
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

    void initialProfileOnboardingStore.getDismissed().then((dismissed) => {
      if (!cancelled) {
        setIsDismissed(dismissed);
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
