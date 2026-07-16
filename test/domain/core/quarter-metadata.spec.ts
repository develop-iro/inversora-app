import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveCurrentQuarterMetadata } from '@/core/api/quarter-metadata';

describe('resolveCurrentQuarterMetadata', () => {
  it('resolves Q2 bounds for a mid-year UTC date', () => {
    const meta = resolveCurrentQuarterMetadata(new Date(Date.UTC(2026, 5, 15)));

    assert.deepEqual(meta, {
      quarter: '2026-Q2',
      quarterTag: 'Q2 2026',
      periodStart: '2026-04-01',
      periodEnd: '2026-06-30',
    });
  });

  it('resolves Q1 for January', () => {
    const meta = resolveCurrentQuarterMetadata(new Date(Date.UTC(2026, 0, 1)));
    assert.equal(meta.quarterTag, 'Q1 2026');
    assert.equal(meta.periodStart, '2026-01-01');
    assert.equal(meta.periodEnd, '2026-03-31');
  });
});
