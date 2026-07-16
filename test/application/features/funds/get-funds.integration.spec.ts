import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { AppError } from '@/core/errors/app-error';
import { invalidateCache } from '@/core/query/query-cache';
import { createFundsCatalogService } from '@/features/funds/services/get-funds.factory';
import { buildApiFund, buildFundListPayload } from '@test/support/fixtures/api-fund';
import { createMemoryHttpGet } from '@test/support/doubles/memory-http-get';

afterEach(() => {
  invalidateCache();
});

describe('get-funds application', () => {
  it('returns filtered mock catalog pages when mock data is enabled', async () => {
    const http = createMemoryHttpGet();
    const service = createFundsCatalogService({
      apiGet: http.apiGet,
      shouldUseMockData: () => true,
      allowsMockFallback: () => false,
    });

    const page = await service.getFundsPage({ query: 'world' }, 1);
    const funds = await service.getFunds({ query: 'world' });
    const suggestions = await service.searchCatalogFunds('world', { limit: 2 });

    assert.ok(page.data.length > 0);
    assert.equal(page.meta.page, 1);
    assert.equal(funds.length, page.meta.total);
    assert.ok(suggestions.length <= 2);
    assert.equal(http.requests.length, 0);
  });

  it('parses API catalog pages and applies client-only filters', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/funds',
        handler: () =>
          buildFundListPayload([
            buildApiFund({ isin: 'IE00VISIBLE01', score: 90 }),
            buildApiFund({
              id: 'quarantined',
              isin: 'IE00QUARANT01',
              score: 80,
              catalogVisibility: 'quarantined',
            }),
          ]),
      },
    ]);
    const service = createFundsCatalogService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
    });

    const page = await service.getFundsPage(undefined, 1, new AbortController().signal);

    assert.equal(page.data.length, 1);
    assert.equal(page.data[0]?.isin, 'IE00VISIBLE01');
    assert.equal(http.requests[0]?.path, '/funds');
  });

  it('falls back to mock catalog metrics when the API fails and fallback is allowed', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/funds/catalog-metrics',
        handler: () => {
          throw new AppError('API_REQUEST_FAILED', 'down', undefined, 503);
        },
      },
    ]);
    const service = createFundsCatalogService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => true,
    });

    const metrics = await service.getCatalogMetrics();

    assert.ok(metrics.total > 0);
    assert.ok(metrics.categories.length > 0);
  });

  it('returns an empty suggestion list for blank search queries', async () => {
    const service = createFundsCatalogService({
      apiGet: async () => {
        throw new Error('should not call API');
      },
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
    });

    assert.deepEqual(await service.searchCatalogFunds('   '), []);
  });
});
