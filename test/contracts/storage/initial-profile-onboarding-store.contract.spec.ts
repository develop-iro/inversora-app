import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { INITIAL_PROFILE_DISMISSED_STORAGE_KEY } from '@/core/storage/initial-profile-onboarding-storage-key';
import { createInitialProfileOnboardingStore } from '@/core/storage/initial-profile-onboarding-store.factory';
import { createMemoryKeyValueStorage } from '@test/support/doubles/memory-key-value-storage';

describe('initialProfileOnboardingStore contract', () => {
  it('persists dismiss state on native platforms', async () => {
    const storage = createMemoryKeyValueStorage();
    const store = createInitialProfileOnboardingStore({
      storage,
      platformOs: 'ios',
    });

    assert.equal(await store.getDismissed(), false);
    await store.setDismissed();
    assert.equal(await store.getDismissed(), true);
    assert.equal(storage.dump()[INITIAL_PROFILE_DISMISSED_STORAGE_KEY], 'true');

    await store.clearDismissed();
    assert.equal(await store.getDismissed(), false);
  });

  it('no-ops dismiss persistence on web', async () => {
    const storage = createMemoryKeyValueStorage();
    const store = createInitialProfileOnboardingStore({
      storage,
      platformOs: 'web',
    });

    await store.setDismissed();
    assert.equal(await store.getDismissed(), false);
    assert.deepEqual(storage.dump(), {});
  });
});
