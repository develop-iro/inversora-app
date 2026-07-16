import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DEVICE_ID_STORAGE_KEY,
  DEVICE_TOKEN_STORAGE_KEY,
} from '@/core/storage/device-identity-storage-key';
import { createDeviceIdentityStore } from '@/core/storage/device-identity-store.factory';
import { createMemoryKeyValueStorage } from '@test/support/doubles/memory-key-value-storage';

describe('deviceIdentityStore contract', () => {
  it('reads existing token and device id from storage', async () => {
    const storage = createMemoryKeyValueStorage({
      [DEVICE_TOKEN_STORAGE_KEY]: 'token-1',
      [DEVICE_ID_STORAGE_KEY]: 'device-1',
    });
    const store = createDeviceIdentityStore({ storage, platformOs: 'web' });

    assert.equal(await store.getDeviceToken(), 'token-1');
    assert.equal(await store.getDeviceId(), 'device-1');
  });

  it('short-circuits registration when credentials already exist', async () => {
    let registerCalls = 0;
    const storage = createMemoryKeyValueStorage({
      [DEVICE_TOKEN_STORAGE_KEY]: 'token-1',
      [DEVICE_ID_STORAGE_KEY]: 'device-1',
    });
    const store = createDeviceIdentityStore({
      storage,
      platformOs: 'ios',
      registerDevice: async () => {
        registerCalls += 1;
        return { deviceToken: 'new', deviceId: 'new' };
      },
    });

    await store.ensureDeviceRegistered();
    assert.equal(registerCalls, 0);
  });

  it('registers and persists credentials when missing', async () => {
    const storage = createMemoryKeyValueStorage();
    const store = createDeviceIdentityStore({
      storage,
      platformOs: 'android',
      appVersion: '1.2.3',
      registerDevice: async (body) => {
        assert.equal(body.platform, 'android');
        assert.equal(body.appVersion, '1.2.3');
        return { deviceToken: 'token-new', deviceId: 'device-new' };
      },
    });

    await store.ensureDeviceRegistered();
    assert.equal(await store.getDeviceToken(), 'token-new');
    assert.equal(await store.getDeviceId(), 'device-new');
  });
});
