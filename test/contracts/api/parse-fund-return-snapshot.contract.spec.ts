import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  EMPTY_FUND_HISTORICAL_RETURNS,
  parseFundReturnSnapshot,
  resolveFundReturnSnapshotFromApi,
} from '@/core/api/parse-fund-return-snapshot';

describe('parseFundReturnSnapshot', () => {
  it('parses a complete returns object', () => {
    assert.deepEqual(
      parseFundReturnSnapshot({
        ytd: 1.5,
        oneYear: 8,
        threeYear: 20,
        asOf: '2026-06-30',
      }),
      {
        ytd: 1.5,
        oneYear: 8,
        threeYear: 20,
        asOf: '2026-06-30',
      },
    );
  });

  it('allows null metric fields', () => {
    assert.deepEqual(
      parseFundReturnSnapshot({
        ytd: null,
        oneYear: null,
        threeYear: null,
        asOf: null,
      }),
      {
        ytd: null,
        oneYear: null,
        threeYear: null,
        asOf: null,
      },
    );
  });

  it('rejects invalid shapes', () => {
    assert.equal(parseFundReturnSnapshot(null), null);
    assert.equal(parseFundReturnSnapshot({ ytd: '8', oneYear: 1, threeYear: 2, asOf: null }), null);
  });
});

describe('resolveFundReturnSnapshotFromApi', () => {
  it('falls back to the empty snapshot when parsing fails', () => {
    assert.deepEqual(resolveFundReturnSnapshotFromApi(undefined), EMPTY_FUND_HISTORICAL_RETURNS);
  });
});
