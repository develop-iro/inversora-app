import {
  curriculumProgressSchema,
  type CurriculumProgress,
} from '@/features/learn/entities/learn-curriculum.schema';
import { AppError } from '@/core/errors/app-error';
import { LEARN_CURRICULUM_PROGRESS_STORAGE_KEY } from '@/core/storage/learn-curriculum-progress-storage-key';
import {
  deleteSecureValue,
  migrateLegacyAsyncStorageValue,
  readSecureValue,
  writeSecureValue,
} from '@/core/storage/secure-storage';

type CurriculumProgressListener = () => void;

const listeners = new Set<CurriculumProgressListener>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

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
 * Local persistence for beginner curriculum completion state.
 */
export const learnCurriculumProgressStore = {
  async getProgress(): Promise<CurriculumProgress | null> {
    await migrateLegacyAsyncStorageValue(LEARN_CURRICULUM_PROGRESS_STORAGE_KEY);
    const raw = await readSecureValue(LEARN_CURRICULUM_PROGRESS_STORAGE_KEY);
    return parseProgress(raw);
  },

  async saveProgress(progress: CurriculumProgress): Promise<void> {
    const validated = curriculumProgressSchema.safeParse(progress);

    if (!validated.success) {
      throw new AppError('STORAGE_WRITE_FAILED', 'El progreso del curriculum no es válido.');
    }

    await writeSecureValue(
      LEARN_CURRICULUM_PROGRESS_STORAGE_KEY,
      JSON.stringify(validated.data),
    );
    notifyListeners();
  },

  async markLessonCompleted(lessonId: string): Promise<CurriculumProgress> {
    const current = (await this.getProgress()) ?? {
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

    await this.saveProgress(next);
    return next;
  },

  async clearProgress(): Promise<void> {
    await deleteSecureValue(LEARN_CURRICULUM_PROGRESS_STORAGE_KEY);
    notifyListeners();
  },
};

/**
 * Subscribes to curriculum progress changes.
 *
 * @param listener - Callback invoked when progress is saved or cleared.
 */
export function subscribeLearnCurriculumProgress(listener: CurriculumProgressListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
