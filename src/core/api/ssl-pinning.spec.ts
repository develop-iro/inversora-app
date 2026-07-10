import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SSL_PINNED_HOSTS } from './ssl-pinning.constants';

describe('ssl-pinning', () => {
  it('lists the production and QA API hosts', () => {
    assert.deepEqual(SSL_PINNED_HOSTS, [
      'inversora-api-production.up.railway.app',
      'inversora-api-qa.up.railway.app',
    ]);
  });
});
