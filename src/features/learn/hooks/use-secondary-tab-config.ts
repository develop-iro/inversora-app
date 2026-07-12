import { useMemo } from 'react';

import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import {
  resolveSecondaryTabConfig,
  resolveSecondaryTabMode,
  type SecondaryTabConfig,
} from '@/features/learn/services/secondary-tab-config';

type UseSecondaryTabConfigResult = SecondaryTabConfig & {
  readonly isLoading: boolean;
};

/**
 * Reactive secondary tab configuration based on the educational profile.
 */
export function useSecondaryTabConfig(): UseSecondaryTabConfigResult {
  const { profile, isLoading } = useEducationalProfile();

  return useMemo(() => {
    const mode = resolveSecondaryTabMode(profile);

    return {
      ...resolveSecondaryTabConfig(mode),
      isLoading,
    };
  }, [isLoading, profile]);
}

export {
  resolveSecondaryTabConfig,
  resolveSecondaryTabMode,
  type SecondaryTabConfig,
} from '@/features/learn/services/secondary-tab-config';
