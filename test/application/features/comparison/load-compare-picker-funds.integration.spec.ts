import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createComparePickerFundsService } from '@/features/comparison/services/load-compare-picker-funds.factory';
import { createFundsCatalogService } from '@/features/funds/services/get-funds.factory';
import { buildApiFund, buildFundListPayload } from '@test/support/fixtures/api-fund';
import { createMemoryHttpGet } from '@test/support/doubles/memory-http-get';

describe('load-compare-picker-funds application', () => {
  it('loads mock picker funds sorted by score when mock data is enabled', async () => {
    const http = createMemoryHttpGet();
    const catalog = createFundsCatalogService({
      apiGet: http.apiGet,
      shouldUseMockData: () => true,
      allowsMockFallback: () => false,
    });
    const service = createComparePickerFundsService({
      shouldUseMockData: () => true,
      allowsMockFallback: () => false,
      getFundsPage: catalog.getFundsPage,
      searchCatalogFunds: catalog.searchCatalogFunds,
    });

    const funds = await service.loadComparePickerFunds('', { limit: 3 });

    assert.ok(funds.length > 0);
    assert.ok(funds.length <= 3);
    for (let index = 1; index < funds.length; index += 1) {
      assert.ok(funds[index - 1]!.inversoraScore >= funds[index]!.inversoraScore);
    }
  });

  it('searches the API catalog for non-empty picker queries', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/funds',
        handler: (options) => {
          assert.equal(options.searchParams?.q, 'world');
          return buildFundListPayload([
            buildApiFund({ isin: 'IE00PICKER001', name: 'World Picker Fund', score: 92 }),
          ]);
        },
      },
    ]);
    const catalog = createFundsCatalogService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
    });
    const service = createComparePickerFundsService({
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
      getFundsPage: catalog.getFundsPage,
      searchCatalogFunds: catalog.searchCatalogFunds,
    });

    const funds = await service.loadComparePickerFunds('world', { limit: 5 });

    assert.equal(funds.length, 1);
    assert.equal(funds[0]?.isin, 'IE00PICKER001');
  });
});
