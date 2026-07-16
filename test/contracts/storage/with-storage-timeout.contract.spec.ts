import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { withStorageTimeout } from '@/core/storage/with-storage-timeout';

describe('withStorageTimeout', () => {
  it('returns the resolved value when it settles before the timeout', async () => {
    const result = await withStorageTimeout(Promise.resolve('ok'), 50, 'fallback');
    assert.equal(result, 'ok');
  });

  it('returns the fallback when the promise hangs past the timeout', async () => {
    const hanging = new Promise<string>(() => {
      // Intentionally never settles.
    });

    const result = await withStorageTimeout(hanging, 20, 'fallback');
    assert.equal(result, 'fallback');
  });
});
