import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AppError } from '@/core/errors/app-error';
import { createClearLocalUserData } from '@/features/legal/services/clear-local-user-data.factory';
import { createRequestDataDeletion } from '@/features/legal/services/request-data-deletion.factory';
import { createMemoryHttpDelete } from '@test/support/doubles/memory-http-delete';

describe('clearLocalUserData application', () => {
  it('clears all local stores including device identity last', async () => {
    const order: string[] = [];
    const clearLocalUserData = createClearLocalUserData({
      clearFavorites: async () => {
        order.push('favorites');
      },
      clearEducationalProfile: async () => {
        order.push('profile');
      },
      clearCompareSelection: async () => {
        order.push('compare');
      },
      clearInitialProfileDismissed: async () => {
        order.push('onboarding');
      },
      clearCurriculumProgress: async () => {
        order.push('curriculum');
      },
      clearAnalyticsSession: async () => {
        order.push('analytics');
      },
      clearDeviceIdentity: async () => {
        order.push('device');
      },
    });

    await clearLocalUserData();

    assert.ok(order.includes('favorites'));
    assert.ok(order.includes('profile'));
    assert.equal(order[order.length - 1], 'device');
  });
});

describe('requestDataDeletion application', () => {
  it('wipes only local data when no device token exists', async () => {
    let localCleared = false;
    const http = createMemoryHttpDelete([]);
    const requestDataDeletion = createRequestDataDeletion({
      getDeviceToken: async () => null,
      apiDelete: http.apiDelete,
      clearLocalUserData: async () => {
        localCleared = true;
      },
    });

    const result = await requestDataDeletion();

    assert.deepEqual(result, { serverDeleted: false, localCleared: true });
    assert.equal(localCleared, true);
    assert.equal(http.requests.length, 0);
  });

  it('deletes server data then clears local stores on success', async () => {
    let localCleared = false;
    const http = createMemoryHttpDelete([
      {
        path: '/anonymous-devices/me',
        handler: () => ({ deleted: true, deviceId: 'device-1' }),
      },
    ]);
    const requestDataDeletion = createRequestDataDeletion({
      getDeviceToken: async () => 'dev_token',
      apiDelete: http.apiDelete,
      clearLocalUserData: async () => {
        localCleared = true;
      },
    });

    const result = await requestDataDeletion();

    assert.deepEqual(result, { serverDeleted: true, localCleared: true });
    assert.equal(localCleared, true);
    assert.equal(http.requests[0]?.withDeviceToken, true);
  });

  it('clears local data when the server reports unknown device', async () => {
    let localCleared = false;
    const http = createMemoryHttpDelete([
      {
        path: '/anonymous-devices/me',
        status: 401,
        handler: () => null,
      },
    ]);
    const requestDataDeletion = createRequestDataDeletion({
      getDeviceToken: async () => 'dev_token',
      apiDelete: http.apiDelete,
      clearLocalUserData: async () => {
        localCleared = true;
      },
    });

    const result = await requestDataDeletion();

    assert.deepEqual(result, { serverDeleted: false, localCleared: true });
    assert.equal(localCleared, true);
  });

  it('does not clear local data on network failures', async () => {
    let localCleared = false;
    const requestDataDeletion = createRequestDataDeletion({
      getDeviceToken: async () => 'dev_token',
      apiDelete: async () => {
        throw new AppError('API_REQUEST_FAILED', 'network down', undefined, 503);
      },
      clearLocalUserData: async () => {
        localCleared = true;
      },
    });

    await assert.rejects(() => requestDataDeletion(), AppError);
    assert.equal(localCleared, false);
  });
});
