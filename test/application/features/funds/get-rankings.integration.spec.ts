import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createRankingsService } from '@/features/funds/services/get-rankings.factory';
import { createMemoryHttpGet } from '@test/support/doubles/memory-http-get';

function buildRankingsPayload() {
  return {
    data: [
      {
        benchmark: 'MSCI World',
        benchmarkKey: 'msci-world',
        total: 2,
        funds: [
          {
            rank: 1,
            id: 'fund-a',
            symbol: 'WORLD-A',
            isin: 'ES0000000001',
            name: 'World A',
            score: 91.4,
            benchmark: 'MSCI World',
            currency: 'EUR',
            riskLevel: 4,
            ter: 0.12,
            returns: {
              ytd: 4.8,
              oneYear: 11.2,
              threeYear: 28.6,
              asOf: '2026-06-30',
            },
          },
          {
            rank: 2,
            id: 'fund-b',
            symbol: 'WORLD-B',
            isin: 'ES0000000002',
            name: 'World B',
            score: 84,
            benchmark: 'MSCI World',
            currency: 'EUR',
            riskLevel: 3,
            ter: 0.2,
            returns: {
              ytd: 3.1,
              oneYear: 9.4,
              threeYear: 22.1,
              asOf: '2026-06-30',
            },
          },
        ],
      },
    ],
    meta: {
      totalGroups: 1,
      returnedGroups: 1,
      groupsLimit: 10,
      limit: 10,
      hasMoreGroups: false,
      totalEligibleFunds: 2,
    },
  };
}

describe('get-rankings application', () => {
  it('returns mock rankings when mock data is enabled', async () => {
    const http = createMemoryHttpGet();
    const service = createRankingsService({
      apiGet: http.apiGet,
      shouldUseMockData: () => true,
    });

    const ranked = await service.getRankings({ limit: 3 });
    const groups = await service.getRankingsGrouped({ limit: 2 });

    assert.ok(ranked.length > 0);
    assert.ok(ranked.length <= 3);
    assert.ok(groups.length > 0);
    assert.equal(http.requests.length, 0);
  });

  it('parses API rankings, caches groups, and exposes meta', async () => {
    const http = createMemoryHttpGet([
      {
        path: '/rankings',
        handler: () => buildRankingsPayload(),
      },
    ]);
    const service = createRankingsService({
      apiGet: http.apiGet,
      shouldUseMockData: () => false,
    });

    const groups = await service.getRankingsGrouped();
    const ranked = await service.getRankings({ limit: 1 });
    const meta = service.getCachedRankingsMeta();

    assert.equal(groups.length, 1);
    assert.equal(groups[0]?.funds.length, 2);
    assert.equal(ranked.length, 1);
    assert.equal(ranked[0]?.isin, 'ES0000000001');
    assert.equal(meta?.totalEligibleFunds, 2);
    assert.equal(http.requests.length, 1);

    service.resetRankingsCache();
    assert.equal(service.getCachedRankingsMeta(), null);
  });
});
