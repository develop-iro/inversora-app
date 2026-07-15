import { useCallback, useEffect, useState } from 'react';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import {
  educationalProfileStore,
  subscribeEducationalProfile,
} from '@/core/storage/educational-profile-store';
import { learnCurriculumProgressStore } from '@/core/storage/learn-curriculum-progress-store';
import {
  STORAGE_READ_TIMEOUT_MS,
  withStorageTimeout,
} from '@/core/storage/with-storage-timeout';
import { syncEducationalProfileToServer } from '@/features/learn/services/educational-profile-sync';
import {
  resolveCurriculumGraduatedProfile,
  shouldPersistGraduatedProfile,
} from '@/features/learn/services/educational-profile-graduation';

type UseEducationalProfileResult = {
  profile: EducationalProfile | null;
  isLoading: boolean;
  saveProfile: (profile: EducationalProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
};

/**
 * Reads and updates the locally stored educational profile.
 *
 * Storage failures degrade to `profile: null` so native gates and the
 * Aprendizaje tab never stay blocked on an indefinite spinner.
 */
export function useEducationalProfile(): UseEducationalProfileResult {
  const [profile, setProfile] = useState<EducationalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [nextProfile, curriculumProgress] = await Promise.all([
          withStorageTimeout(
            educationalProfileStore.getProfile(),
            STORAGE_READ_TIMEOUT_MS,
            null,
          ),
          withStorageTimeout(
            learnCurriculumProgressStore.getProgress(),
            STORAGE_READ_TIMEOUT_MS,
            null,
          ),
        ]);

        const graduatedProfile = resolveCurriculumGraduatedProfile(
          nextProfile,
          curriculumProgress,
        );

        if (
          graduatedProfile !== null &&
          shouldPersistGraduatedProfile(nextProfile, graduatedProfile)
        ) {
          try {
            await educationalProfileStore.saveProfile(graduatedProfile);
            void syncEducationalProfileToServer(graduatedProfile);
          } catch {
            // Keep the in-memory graduated profile even if persistence fails.
          }

          if (!cancelled) {
            setProfile(graduatedProfile);
            setIsLoading(false);
          }

          return;
        }

        if (!cancelled) {
          setProfile(nextProfile);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
          setIsLoading(false);
        }
      }
    };

    void load();
    return subscribeEducationalProfile(() => {
      void load();
    });
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
