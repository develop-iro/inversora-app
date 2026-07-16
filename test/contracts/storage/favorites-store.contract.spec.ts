import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { FAVORITES_STORAGE_KEY } from '@/core/storage/favorites-storage-key';
import { createFavoritesStore } from '@/core/storage/favorites-store.factory';
import { createMemoryKeyValueStorage } from '@test/support/doubles/memory-key-value-storage';

describe('favoritesStore contract', () => {
  it('toggles favorites and persists ISINs', async () => {
    const storage = createMemoryKeyValueStorage();
    const store = createFavoritesStore(storage);

    assert.deepEqual(await store.listFavoriteIsins(), []);
    assert.equal(await store.isFavorite('IE00B4L5Y983'), false);

    await store.toggleFavorite('IE00B4L5Y983');
    assert.equal(await store.isFavorite('IE00B4L5Y983'), true);
    assert.deepEqual(await store.listFavoriteIsins(), ['IE00B4L5Y983']);

    await store.toggleFavorite('IE00B4L5Y983');
    assert.equal(await store.isFavorite('IE00B4L5Y983'), false);
    assert.deepEqual(await store.listFavoriteIsins(), []);
  });

  it('ignores corrupt persisted payloads', async () => {
    const storage = createMemoryKeyValueStorage({
      [FAVORITES_STORAGE_KEY]: '{not-json',
    });
    const store = createFavoritesStore(storage);

    assert.deepEqual(await store.listFavoriteIsins(), []);
  });

  it('notifies subscribers on toggle', async () => {
    const store = createFavoritesStore(createMemoryKeyValueStorage());
    let notifications = 0;
    const unsubscribe = store.subscribe(() => {
      notifications += 1;
    });

    await store.toggleFavorite('IE00TEST0001');
    unsubscribe();
    await store.toggleFavorite('IE00TEST0001');

    assert.equal(notifications, 1);
  });
});
