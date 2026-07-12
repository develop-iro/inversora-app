import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isTransportSecurityHost,
  SSL_PINNED_HOSTS,
  TRANSPORT_SECURITY_HOSTS,
} from './ssl-pinning.constants';

describe('ssl-pinning', () => {
  it('lists the production and QA API hosts for transport security hardening', () => {
    const expected = [
      'inversora-api-production.up.railway.app',
      'inversora-api-staging.up.railway.app',
    ];

    assert.deepEqual(TRANSPORT_SECURITY_HOSTS, expected);
    assert.deepEqual(SSL_PINNED_HOSTS, expected);
  });

  it('checks whether an API host is covered by transport security hardening', () => {
    assert.equal(
      isTransportSecurityHost('inversora-api-production.up.railway.app'),
      true,
    );
    assert.equal(
      isTransportSecurityHost('INVERSORA-API-STAGING.UP.RAILWAY.APP'),
      true,
    );
    assert.equal(isTransportSecurityHost('evil.example'), false);
  });
});
