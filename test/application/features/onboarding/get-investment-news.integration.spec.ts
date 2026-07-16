import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AppError } from '@/core/errors/app-error';
import { createInvestmentNewsService } from '@/features/onboarding/services/get-investment-news.factory';
import { createMemoryHttpGet } from '@test/support/doubles/memory-http-get';

describe('get-investment-news application', () => {
  it('returns bundled headlines when the news API is disabled', async () => {
    const http = createMemoryHttpGet();
    const service = createInvestmentNewsService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
      isNewsApiEnabled: () => false,
    });

    const news = await service.getInvestmentNews({ limit: 2 });

    assert.equal(news.length, 2);
    assert.equal(http.requests.length, 0);
  });

  it('parses API headlines when the news API is enabled', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/news',
        handler: () => ({
          data: [
            {
              id: 'api-news-1',
              title: 'Qué es el tracking error',
              summary: 'Resumen educativo desde API.',
              source: 'Inversora Educa',
              publishedAt: '2026-06-20',
              category: 'concepto',
            },
            {
              id: 'api-news-2',
              title: 'TER y costes',
              summary: 'Otro resumen.',
              source: 'Inversora Educa',
              publishedAt: '2026-06-19',
              category: 'concepto',
            },
          ],
        }),
      },
    ]);
    const service = createInvestmentNewsService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => false,
      isNewsApiEnabled: () => true,
    });

    const news = await service.getInvestmentNews({ limit: 1 });

    assert.equal(news.length, 1);
    assert.equal(news[0]?.id, 'api-news-1');
    assert.equal(http.requests[0]?.searchParams?.limit, 1);
  });

  it('falls back to bundled headlines on API failure when allowed', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/news',
        handler: () => {
          throw new AppError('API_REQUEST_FAILED', 'down', undefined, 503);
        },
      },
    ]);
    const service = createInvestmentNewsService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
      allowsMockFallback: () => true,
      isNewsApiEnabled: () => true,
    });

    const news = await service.getInvestmentNews({ limit: 3 });

    assert.equal(news.length, 3);
  });
});
