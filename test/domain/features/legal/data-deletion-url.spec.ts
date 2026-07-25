import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getDataDeletionUrl } from '@/features/legal/constants/data-deletion-url';

describe('getDataDeletionUrl', () => {
  it('returns an https data deletion URL', () => {
    const url = getDataDeletionUrl();

    assert.ok(url.startsWith('https://'));
    assert.ok(url.endsWith('/eliminacion.html'));
  });
});
