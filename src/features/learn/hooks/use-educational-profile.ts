import { useCallback, useEffect, useState } from 'react';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import {
  educationalProfileStore,
  subscribeEducationalProfile,
} from '@/core/storage/educational-profile-store';

type UseEducationalProfileResult = {
  profile: EducationalProfile | null;
  isLoading: boolean;
  saveProfile: (profile: EducationalProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
};

/**
 * Reads and updates the locally stored educational profile.
 */
export function useEducationalProfile(): UseEducationalProfileResult {
  const [profile, setProfile] = useState<EducationalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      educationalProfileStore.getProfile().then((nextProfile) => {
        if (!cancelled) {
          setProfile(nextProfile);
          setIsLoading(false);
        }
      });
    };

    load();
    return subscribeEducationalProfile(load);
  }, []);

  const saveProfile = useCallback(async (nextProfile: EducationalProfile) => {
    await educationalProfileStore.saveProfile(nextProfile);
    setProfile(nextProfile);
  }, []);

  const clearProfile = useCallback(async () => {
    await educationalProfileStore.clearProfile();
    setProfile(null);
  }, []);

  return {
    profile,
    isLoading,
    saveProfile,
    clearProfile,
  };
}
