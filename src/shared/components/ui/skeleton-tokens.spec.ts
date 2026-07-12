import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { semanticColors } from '@/shared/theme/colors';

import {
  getSkeletonTokens,
  SKELETON_SHIMMER_DURATION_MS,
} from './skeleton-tokens';

describe('skeleton-tokens', () => {
  it('exposes high-contrast base and pulse-dark tokens for visible crossfade', () => {
    const tokens = getSkeletonTokens(semanticColors.light);

    assert.equal(tokens.base, '#E8E8E8');
    assert.equal(tokens.pulseDark, '#D0D0D0');
    assert.notEqual(tokens.base, tokens.pulseDark);
  });

  it('uses a relaxed pulse duration aligned with global.css keyframes', () => {
    assert.equal(SKELETON_SHIMMER_DURATION_MS, 1400);
    assert.ok(SKELETON_SHIMMER_DURATION_MS >= 1200);
    assert.ok(SKELETON_SHIMMER_DURATION_MS <= 2000);
  });
});