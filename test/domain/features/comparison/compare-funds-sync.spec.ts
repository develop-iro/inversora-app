import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { areCompareFundsOutOfSync } from '@/features/comparison/utils/compare-funds-sync';

describe('areCompareFundsOutOfSync', () => {
  it('returns false when no funds are selected', () => {
    assert.equal(areCompareFundsOutOfSync([], []), false);
  });

  it('returns true when selection has more ISINs than loaded entries', () => {
    assert.equal(
      areCompareFundsOutOfSync(
        ['IE00B4L5Y983', 'IE00B3XXRP09'],
        [{ isin: 'IE00B4L5Y983', detail: null, errorMessage: null }],
      ),
      true,
    );
  });

  it('returns true when loaded entries do not match the selected ISINs', () => {
    assert.equal(
      areCompareFundsOutOfSync(
        ['IE00B4L5Y983', 'IE00B3XXRP09'],
        [
          { isin: 'IE00B4L5Y983', detail: null, errorMessage: null },
          { isin: 'IE00B5BMR87', detail: null, errorMessage: null },
        ],
      ),
      true,
    );
  });

  it('returns false when entries align with the selected ISINs', () => {
    assert.equal(
      areCompareFundsOutOfSync(
        ['IE00B4L5Y983', 'IE00B3XXRP09'],
        [
          { isin: 'IE00B4L5Y983', detail: null, errorMessage: null },
          { isin: 'IE00B3XXRP09', detail: null, errorMessage: null },
        ],
      ),
      false,
    );
  });
});
