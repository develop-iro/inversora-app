import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildDonutSegments,
  resolveDonutSegmentAtPoint,
} from '@/features/calculator/utils/calculator-breakdown-donut';

describe('buildDonutSegments', () => {
  it('maps breakdown values to clockwise segments from the top', () => {
    const segments = buildDonutSegments(
      {
        initialComponent: 1000,
        depositsComponent: 12000,
        interestComponent: 4239.94,
      },
      {
        initial: '#0B2E36',
        deposits: '#00B8A9',
        interest: '#0F766E',
      },
    );

    assert.equal(segments.length, 3);
    assert.equal(segments[0]?.key, 'initial');
    assert.equal(segments[0]?.startAngle, 0);
    assert.equal(segments[1]?.key, 'deposits');
    assert.equal(segments[2]?.key, 'interest');
    assert.ok(Math.abs((segments[2]?.endAngle ?? 0) - 360) < 0.001);
  });

  it('omits zero-value segments', () => {
    const segments = buildDonutSegments(
      {
        initialComponent: 0,
        depositsComponent: 5000,
        interestComponent: 1000,
      },
      {
        initial: '#0B2E36',
        deposits: '#00B8A9',
        interest: '#0F766E',
      },
    );

    assert.equal(segments.length, 2);
    assert.equal(segments[0]?.key, 'deposits');
    assert.equal(segments[1]?.key, 'interest');
  });
});

describe('resolveDonutSegmentAtPoint', () => {
  const segments = buildDonutSegments(
    {
      initialComponent: 1000,
      depositsComponent: 12000,
      interestComponent: 4239.94,
    },
    {
      initial: '#0B2E36',
      deposits: '#00B8A9',
      interest: '#0F766E',
    },
  );

  it('returns null for taps outside the ring', () => {
    assert.equal(resolveDonutSegmentAtPoint(110, 110, 220, 62, 100, segments), null);
    assert.equal(resolveDonutSegmentAtPoint(5, 110, 220, 62, 100, segments), null);
  });

  it('resolves taps on the top segment', () => {
    assert.equal(resolveDonutSegmentAtPoint(110, 20, 220, 62, 100, segments), 'initial');
  });
});
