import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import {
  initialProfileOnboardingStore,
  shouldUseInitialProfileGate,
} from '@/core/storage/initial-profile-onboarding-store';
import { shouldRedirectToInitialProfileQuestionnaire } from '@/core/storage/initial-profile-onboarding-policy';
import { trackLearnGateRedirect } from '@/features/learn/services/learn-questionnaire-analytics';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import { routes } from '@/shared/navigation/routes';

export type InitialProfileGateProps = {
  /** When false, the gate waits (e.g. while the launch splash is visible). */
  readonly enabled: boolean;
};

/**
 * Redirects first-time native users to the initial profiling questionnaire.
 *
 * Web users are not gated. Allowed routes without a profile: `/learn` and `/legal`.
 */
export function InitialProfileGate({ enabled }: InitialProfileGateProps) {
  const router = useRouter();
  const segments = useSegments();
  const { profile, isLoading: isProfileLoading } = useEducationalProfile();
  const [isDismissed, setIsDismissed] = useState<boolean | null>(() =>
    shouldUseInitialProfileGate() ? null : false,
  );
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!shouldUseInitialProfileGate()) {
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
  }, []);

  useEffect(() => {
    if (
      !shouldRedirectToInitialProfileQuestionnaire({
        enabled,
        useGate: shouldUseInitialProfileGate(),
        isProfileLoading,
        isDismissed,
        hasProfile: profile !== null,
        hasRedirected: hasRedirectedRef.current,
        segments,
      })
    ) {
      return;
    }

    hasRedirectedRef.current = true;
    trackLearnGateRedirect();
    router.replace(routes.learnInitial);
  }, [enabled, isDismissed, isProfileLoading, profile, router, segments]);

  return null;
}
