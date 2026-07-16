import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AppError } from '@/core/errors/app-error';
import { createLearnCurriculumProgressStore } from '@/core/storage/learn-curriculum-progress-store.factory';
import { createMemoryKeyValueStorage } from '@test/support/doubles/memory-key-value-storage';

describe('learnCurriculumProgressStore contract', () => {
  it('marks lessons completed without duplicating ids', async () => {
    const store = createLearnCurriculumProgressStore(createMemoryKeyValueStorage());

    const first = await store.markLessonCompleted('lesson-1');
    assert.deepEqual(first.completedLessonIds, ['lesson-1']);
    assert.equal(first.lastLessonId, 'lesson-1');

    const second = await store.markLessonCompleted('lesson-1');
    assert.deepEqual(second.completedLessonIds, ['lesson-1']);

    const third = await store.markLessonCompleted('lesson-2');
    assert.deepEqual(third.completedLessonIds, ['lesson-1', 'lesson-2']);
  });

  it('rejects invalid progress payloads', async () => {
    const store = createLearnCurriculumProgressStore(createMemoryKeyValueStorage());

    await assert.rejects(
      () =>
        store.saveProgress({
          completedLessonIds: ['lesson-1'],
          updatedAt: 'not-a-datetime',
        }),
      (error: unknown) => error instanceof AppError && error.code === 'STORAGE_WRITE_FAILED',
    );
  });

  it('clears persisted progress', async () => {
    const store = createLearnCurriculumProgressStore(createMemoryKeyValueStorage());
    await store.markLessonCompleted('lesson-1');
    await store.clearProgress();
    assert.equal(await store.getProgress(), null);
  });
});
