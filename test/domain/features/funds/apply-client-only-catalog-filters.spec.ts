import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { applyClientOnlyCatalogFilters } from '@/features/funds/utils/apply-client-only-catalog-filters';
import { buildCatalogFund } from '@test/support/fixtures/catalog-fund';

describe('applyClientOnlyCatalogFilters', () => {
  const funds = [
    buildCatalogFund({ isin: 'IE00LOW0001', inversoraScore: 70 }),
    buildCatalogFund({ isin: 'IE00HIGH0001', inversoraScore: 95 }),
    buildCatalogFund({ isin: 'IE00MID0001', inversoraScore: 80 }),
  ];

  it('sorts by inversora score descending for non-return sorts', () => {
    const result = applyClientOnlyCatalogFilters(funds, {
      sortBy: 'score',
      sortOrder: 'desc',
    });

    assert.deepEqual(
      result.map((fund) => fund.isin),
      ['IE00HIGH0001', 'IE00MID0001', 'IE00LOW0001'],
    );
  });

  it('does not reshuffle when the active sort is return-based', () => {
    const result = applyClientOnlyCatalogFilters(funds, {
      sortBy: 'return1y',
      sortOrder: 'desc',
    });

    assert.deepEqual(
      result.map((fund) => fund.isin),
      ['IE00LOW0001', 'IE00HIGH0001', 'IE00MID0001'],
    );
  });

  it('does not reshuffle when a min return filter is active', () => {
    const result = applyClientOnlyCatalogFilters(funds, {
      minReturnPercent: 5,
      returnPeriod: '1y',
    });

    assert.deepEqual(
      result.map((fund) => fund.isin),
      ['IE00LOW0001', 'IE00HIGH0001', 'IE00MID0001'],
    );
  });
});
