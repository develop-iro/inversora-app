import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  filterCatalogVisible,
  isCatalogVisible,
} from '@/features/funds/utils/catalog-visibility';
import { buildCatalogFund } from '@test/support/fixtures/catalog-fund';

describe('catalog-visibility', () => {
  it('treats only visible funds as listable', () => {
    assert.equal(isCatalogVisible(buildCatalogFund({ catalogVisibility: 'visible' })), true);
    assert.equal(isCatalogVisible(buildCatalogFund({ catalogVisibility: 'quarantined' })), false);
    assert.equal(isCatalogVisible(buildCatalogFund({ catalogVisibility: 'blocked' })), false);
  });

  it('filters a mixed catalog slice', () => {
    const funds = [
      buildCatalogFund({ isin: 'IE00VISIBLE1', catalogVisibility: 'visible' }),
      buildCatalogFund({ isin: 'IE00QUARANT1', catalogVisibility: 'quarantined' }),
      buildCatalogFund({ isin: 'IE00BLOCKED1', catalogVisibility: 'blocked' }),
    ];

    assert.deepEqual(
      filterCatalogVisible(funds).map((fund) => fund.isin),
      ['IE00VISIBLE1'],
    );
  });
});
