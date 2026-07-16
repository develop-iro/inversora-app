import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createProductFeedbackService } from '@/features/feedback/services/submit-product-feedback.factory';
import { createMemoryHttpPost } from '@test/support/doubles/memory-http-post';

describe('submit-product-feedback application', () => {
  it('posts anonymous feedback with environment metadata and omits blank messages', async () => {
    const http = createMemoryHttpPost([
      {
        path: '/feedback',
        handler: () => ({ accepted: true }),
      },
    ]);
    const service = createProductFeedbackService({
      apiPost: http.apiPost,
      getDeviceId: async () => 'device-123',
      getAppEnvironment: () => 'local',
      getAppVersion: () => '1.2.3',
    });

    await service.submitProductFeedback({
      clarity: 'yes',
      wouldReturn: 'yes',
      message: '   ',
    });

    assert.equal(http.requests.length, 1);
    assert.equal(http.requests[0]?.path, '/feedback');
    assert.deepEqual(http.requests[0]?.body, {
      clarity: 'yes',
      wouldReturn: 'yes',
      surface: 'feedback',
      deviceId: 'device-123',
      appEnv: 'local',
      appVersion: '1.2.3',
    });
  });

  it('includes a trimmed message and custom surface when provided', async () => {
    const http = createMemoryHttpPost([
      {
        path: '/feedback',
        handler: () => ({ accepted: true }),
      },
    ]);
    const service = createProductFeedbackService({
      apiPost: http.apiPost,
      getDeviceId: async () => null,
      getAppEnvironment: () => 'qa',
      getAppVersion: () => undefined,
    });

    await service.submitProductFeedback({
      clarity: 'somewhat',
      wouldReturn: 'maybe',
      message: '  Me ayudó a entender el TER  ',
      surface: 'home',
    });

    assert.deepEqual(http.requests[0]?.body, {
      clarity: 'somewhat',
      wouldReturn: 'maybe',
      surface: 'home',
      deviceId: undefined,
      appEnv: 'qa',
      appVersion: undefined,
      message: 'Me ayudó a entender el TER',
    });
  });
});
