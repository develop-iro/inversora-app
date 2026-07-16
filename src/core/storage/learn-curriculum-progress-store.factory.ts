import {
  curriculumProgressSchema,
  type CurriculumProgress,
} from '@/features/learn/entities/learn-curriculum.schema';
import { AppError } from '@/core/errors/app-error';
import { LEARN_CURRICULUM_PROGRESS_STORAGE_KEY } from '@/core/storage/learn-curriculum-progress-storage-key';
import type { KeyValueStoragePort } from '@/core/storage/key-value-storage-port';

type CurriculumProgressListener = () => void;

function parseProgress(raw: string | null): CurriculumProgress | null {
  if (raw === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const result = curriculumProgressSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Creates a curriculum-progress store bound to a key/value persistence port.
 *
 * @param storage - Persistence adapter.
 */
export function createLearnCurriculumProgressStore(storage: KeyValueStoragePort) {
  const listeners = new Set<CurriculumProgressListener>();

  function notifyListeners(): void {
    listeners.forEach((listener) => listener());
  }

  const store = {
    async getProgress(): Promise<CurriculumProgress | null> {
      await storage.migrateLegacy(LEARN_CURRICULUM_PROGRESS_STORAGE_KEY);
      const raw = await storage.read(LEARN_CURRICULUM_PROGRESS_STORAGE_KEY);
      return parseProgress(raw);
    },

    async saveProgress(progress: CurriculumProgress): Promise<void> {
      const validated = curriculumProgressSchema.safeParse(progress);

      if (!validated.success) {
        throw new AppError('STORAGE_WRITE_FAILED', 'El progreso del curriculum no es válido.');
      }

      await storage.write(
        LEARN_CURRICULUM_PROGRESS_STORAGE_KEY,
        JSON.stringify(validated.data),
      );
      notifyListeners();
    },

    async markLessonCompleted(lessonId: string): Promise<CurriculumProgress> {
      const current = (await store.getProgress()) ?? {
        completedLessonIds: [],
        updatedAt: new Date().toISOString(),
      };

      const completedLessonIds = current.completedLessonIds.includes(lessonId)
        ? current.completedLessonIds
        : [...current.completedLessonIds, lessonId];

      const next: CurriculumProgress = {
        completedLessonIds,
        lastLessonId: lessonId,
        updatedAt: new Date().toISOString(),
      };

      await store.saveProgress(next);
      return next;
    },

    async clearProgress(): Promise<void> {
      await storage.remove(LEARN_CURRICULUM_PROGRESS_STORAGE_KEY);
      notifyListeners();
    },

    subscribe(listener: CurriculumProgressListener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return store;
}
