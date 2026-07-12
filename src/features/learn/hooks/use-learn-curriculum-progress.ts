import { useCallback, useEffect, useState } from 'react';

import {
  educationalProfileStore,
} from '@/core/storage/educational-profile-store';
import {
  learnCurriculumProgressStore,
  subscribeLearnCurriculumProgress,
} from '@/core/storage/learn-curriculum-progress-store';
import type { CurriculumProgress } from '@/features/learn/entities/learn-curriculum.schema';
import { syncEducationalProfileToServer } from '@/features/learn/services/educational-profile-sync';
import {
  resolveCurriculumGraduatedProfile,
  shouldPersistGraduatedProfile,
} from '@/features/learn/services/educational-profile-graduation';

type UseLearnCurriculumProgressResult = {
  progress: CurriculumProgress | null;
  isLoading: boolean;
  markLessonCompleted: (lessonId: string) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
};

/**
 * Reads and updates locally stored curriculum progress for the Aprendizaje tab.
 */
export function useLearnCurriculumProgress(): UseLearnCurriculumProgressResult {
  const [progress, setProgress] = useState<CurriculumProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      learnCurriculumProgressStore.getProgress().then((nextProgress) => {
        if (!cancelled) {
          setProgress(nextProgress);
          setIsLoading(false);
        }
      });
    };

    load();
    return subscribeLearnCurriculumProgress(load);
  }, []);

  const markLessonCompleted = useCallback(async (lessonId: string) => {
    const next = await learnCurriculumProgressStore.markLessonCompleted(lessonId);
    setProgress(next);

    const currentProfile = await educationalProfileStore.getProfile();
    const graduatedProfile = resolveCurriculumGraduatedProfile(currentProfile, next);

    if (
      graduatedProfile !== null &&
      shouldPersistGraduatedProfile(currentProfile, graduatedProfile)
    ) {
      await educationalProfileStore.saveProfile(graduatedProfile);
      void syncEducationalProfileToServer(graduatedProfile);
    }
  }, []);

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress?.completedLessonIds.includes(lessonId) ?? false,
    [progress?.completedLessonIds],
  );

  return {
    progress,
    isLoading,
    markLessonCompleted,
    isLessonCompleted,
  };
}
