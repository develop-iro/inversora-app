import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SLOW_REQUEST_NOTICE_THRESHOLD_MS } from '@/shared/constants/slow-request-notice';

import { shouldShowSlowRequestNotice } from './use-slow-request-notice';

describe('shouldShowSlowRequestNotice', () => {
  it('returns false while loading is idle', () => {
    assert.equal(shouldShowSlowRequestNotice(false, false), false);
    assert.equal(shouldShowSlowRequestNotice(false, true), false);
  });

  it('keeps skeletons while loading is within the threshold', () => {
    assert.equal(shouldShowSlowRequestNotice(true, false), false);
  });

  it('surfaces the notice once loading exceeds the threshold', () => {
    assert.equal(shouldShowSlowRequestNotice(true, true), true);
  });

  it('uses an eight-second default threshold constant', () => {
    assert.equal(SLOW_REQUEST_NOTICE_THRESHOLD_MS, 8_000);
  });
});
