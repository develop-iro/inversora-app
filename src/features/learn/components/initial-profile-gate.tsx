import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';

import { shouldUseInitialProfileGate } from '@/core/storage/initial-profile-onboarding-store';
import { shouldRedirectToInitialProfileQuestionnaire } from '@/core/storage/initial-profile-onboarding-policy';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import { useInitialProfileDismissed } from '@/features/learn/hooks/use-initial-profile-dismissed';
import { trackLearnGateRedirect } from '@/features/learn/services/learn-questionnaire-analytics';
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
  const { isDismissed } = useInitialProfileDismissed();
  const hasRedirectedRef = useRef(false);

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
