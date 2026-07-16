import type { CurriculumProgress } from '@/features/learn/entities/learn-curriculum.schema';
import { createLearnCurriculumProgressStore } from '@/core/storage/learn-curriculum-progress-store.factory';
import { createSecureKeyValueStoragePort } from '@/core/storage/secure-key-value-storage-port';

export { createLearnCurriculumProgressStore } from '@/core/storage/learn-curriculum-progress-store.factory';

const defaultLearnCurriculumProgressStore = createLearnCurriculumProgressStore(
  createSecureKeyValueStoragePort(),
);

/**
 * Local persistence for beginner curriculum completion state.
 */
export const learnCurriculumProgressStore = {
  getProgress: () => defaultLearnCurriculumProgressStore.getProgress(),
  saveProgress: (progress: CurriculumProgress) =>
    defaultLearnCurriculumProgressStore.saveProgress(progress),
  markLessonCompleted: (lessonId: string) =>
    defaultLearnCurriculumProgressStore.markLessonCompleted(lessonId),
  clearProgress: () => defaultLearnCurriculumProgressStore.clearProgress(),
};

/**
 * Subscribes to curriculum progress changes.
 *
 * @param listener - Callback invoked when progress is saved or cleared.
 */
export function subscribeLearnCurriculumProgress(
  listener: Parameters<typeof defaultLearnCurriculumProgressStore.subscribe>[0],
): () => void {
  return defaultLearnCurriculumProgressStore.subscribe(listener);
}
