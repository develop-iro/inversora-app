import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { AppError } from '@/core/errors/app-error';
import { invalidateCache } from '@/core/query/query-cache';
import { createFundByIsinService } from '@/features/funds/services/get-fund-by-isin.factory';
import { buildFundDetailPayload } from '@test/support/fixtures/fund-detail-payload';
import { createMemoryHttpGet } from '@test/support/doubles/memory-http-get';

afterEach(() => {
  invalidateCache();
});

describe('get-fund-by-isin application', () => {
  it('returns null for blank ISINs without calling the API', async () => {
    const http = createMemoryHttpGet();
    const service = createFundByIsinService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
    });

    assert.equal(await service.getFundByIsin('  '), null);
    assert.equal(http.requests.length, 0);
  });

  it('loads and parses fund detail from the API', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/funds/',
        prefix: true,
        handler: () => buildFundDetailPayload(),
      },
    ]);
    const service = createFundByIsinService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
    });

    const detail = await service.getFundByIsin('ie00b4l5y983', new AbortController().signal);

    assert.ok(detail);
    assert.equal(detail.fund.isin, 'IE00B4L5Y983');
    assert.equal(http.requests[0]?.path, '/funds/IE00B4L5Y983');
  });

  it('falls back to the mock detail when the API returns 404 and fallback is allowed', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/funds/',
        prefix: true,
        handler: () => {
          throw new AppError('API_REQUEST_FAILED', 'missing', undefined, 404);
        },
      },
    ]);
    const service = createFundByIsinService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => true,
    });

    const detail = await service.getFundByIsin('IE00B4L5Y983', new AbortController().signal);

    assert.ok(detail);
    assert.equal(detail.fund.isin, 'IE00B4L5Y983');
  });
});
