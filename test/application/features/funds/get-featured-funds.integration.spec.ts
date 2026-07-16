import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AppError } from '@/core/errors/app-error';
import { createFeaturedFundsService } from '@/features/funds/services/get-featured-funds.factory';
import { createFundsCatalogService } from '@/features/funds/services/get-funds.factory';
import { buildFeaturedFund } from '@test/support/fixtures/featured-fund';
import { createMemoryHttpGet } from '@test/support/doubles/memory-http-get';

describe('get-featured-funds application', () => {
  it('returns mock carousel funds when mock data is enabled', async () => {
    const http = createMemoryHttpGet();
    const catalog = createFundsCatalogService({
      apiGet: http.apiGet,
      shouldUseMockData: () => true,
      allowsMockFallback: () => false,
    });
    const service = createFeaturedFundsService({
      apiGet: http.apiGet,
      shouldUseMockData: () => true,
      allowsMockFallback: () => false,
      getFundsPage: catalog.getFundsPage,
    });

    const funds = await service.getFeaturedFundsForCarousel();

    assert.ok(funds.length > 0);
    assert.ok(funds.every((fund) => fund.isFeatured));
    assert.equal(http.requests.length, 0);
  });

  it('prefers beginner-eligible featured funds from the API', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/featured',
        handler: () => ({
          quarter: '2026-Q1',
          quarterTag: 'Q1 2026',
          periodStart: '2026-01-01',
          periodEnd: '2026-03-31',
          data: [
            buildFeaturedFund({
              isin: 'IE00FEATURED1',
              isFeatured: true,
              idealForBeginners: true,
              efficiencyScore: 88,
            }),
            buildFeaturedFund({
              id: 'not-featured',
              isin: 'IE00NOTFEAT01',
              isFeatured: false,
              idealForBeginners: true,
            }),
          ],
        }),
      },
    ]);
    const catalog = createFundsCatalogService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
    });
    const service = createFeaturedFundsService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
      getFundsPage: catalog.getFundsPage,
    });

    const funds = await service.getFeaturedFundsForCarousel();

    assert.equal(funds.length, 1);
    assert.equal(funds[0]?.isin, 'IE00FEATURED1');
  });

  it('falls back to mock carousel funds when the API fails and fallback is allowed', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/featured',
        handler: () => {
          throw new AppError('API_REQUEST_FAILED', 'down', undefined, 503);
        },
      },
    ]);
    const catalog = createFundsCatalogService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => true,
    });
    const service = createFeaturedFundsService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => true,
      getFundsPage: catalog.getFundsPage,
    });

    const funds = await service.getFeaturedFundsForCarousel();

    assert.ok(funds.length > 0);
  });
});
