import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createTimedAbortSignal } from '@/core/api/request-timeout';

describe('createTimedAbortSignal', () => {
  it('aborts when the timeout elapses', async () => {
    const timed = createTimedAbortSignal(20);

    await new Promise((resolve) => setTimeout(resolve, 40));

    assert.equal(timed.signal.aborted, true);
    timed.clear();
  });

  it('aborts when the external signal aborts first', () => {
    const external = new AbortController();
    const timed = createTimedAbortSignal(5_000, external.signal);

    external.abort();

    assert.equal(timed.signal.aborted, true);
    timed.clear();
  });

  it('does not abort after clear', async () => {
    const timed = createTimedAbortSignal(20);
    timed.clear();

    await new Promise((resolve) => setTimeout(resolve, 40));

    assert.equal(timed.signal.aborted, false);
  });
});
