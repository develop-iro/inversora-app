import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { FUND_ISIN_REGEX } from '@/core/domain/fund-isin.pattern';

describe('fund-isin', () => {
  it('accepts valid ISIN values', () => {
    assert.equal(FUND_ISIN_REGEX.test('IE00B4L5Y983'), true);
  });

  it('rejects invalid ISIN values', () => {
    assert.equal(FUND_ISIN_REGEX.test('not-an-isin'), false);
  });

  it('filters invalid entries from lists via parseFundIsinList', () => {
    const values = ['IE00B4L5Y983', 'invalid', 'US78462F1030']
      .map((value) => value.trim().toUpperCase())
      .filter((value) => FUND_ISIN_REGEX.test(value));

    assert.deepEqual(values, ['IE00B4L5Y983', 'US78462F1030']);
  });
});
