import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildObserveConfigureOptions,
  shouldEnableObserve,
} from '@/core/observability/expo-observe-config';

describe('expo-observe-config', () => {
  it('enables Observe only on native mobile platforms', () => {
    assert.equal(shouldEnableObserve('ios'), true);
    assert.equal(shouldEnableObserve('android'), true);
    assert.equal(shouldEnableObserve('web'), false);
    assert.equal(shouldEnableObserve('windows'), false);
  });

  it('builds configure options with environment and filtered isin params', () => {
    const options = buildObserveConfigureOptions('qa');

    assert.deepEqual(options, {
      environment: 'qa',
      dispatchingEnabled: true,
      integrations: {
        'expo-router': {
          filteredParams: ['isin'],
        },
      },
    });
  });
});
