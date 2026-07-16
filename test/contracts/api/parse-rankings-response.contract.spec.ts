import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  flattenRankingsToRankedFunds,
  mapRankingEntryToRankedFund,
  mapRankingsResponseToGroups,
  parseRankingsResponse,
} from '@/core/api/parse-rankings-response';
import { AppError } from '@/core/errors/app-error';

function buildRankedEntry(overrides: Record<string, unknown> = {}) {
  return {
    rank: 1,
    id: 'fund-msci-world-a',
    symbol: 'WORLD-A',
    isin: 'ES0000000001',
    name: 'Inversora MSCI World Index',
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
    ...overrides,
  };
}

describe('parseRankingsResponse', () => {
  it('parses groups and optional meta', () => {
    const response = parseRankingsResponse({
      data: [
        {
          benchmark: 'MSCI World',
          benchmarkKey: 'msci-world',
          total: 2,
          funds: [
            buildRankedEntry(),
            buildRankedEntry({
              rank: 2,
              id: 'fund-b',
              symbol: 'WORLD-B',
              isin: 'ES0000000002',
              score: 84,
            }),
            { invalid: true },
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
    });

    assert.equal(response.data.length, 1);
    assert.equal(response.data[0]?.funds.length, 2);
    assert.equal(response.meta?.totalEligibleFunds, 2);
  });

  it('throws when the envelope is invalid', () => {
    assert.throws(
      () => parseRankingsResponse(null),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });
});

describe('mapRankingEntryToRankedFund', () => {
  it('maps API rows into ranked funds with app risk labels', () => {
    const response = parseRankingsResponse({
      data: [
        {
          benchmark: 'MSCI World',
          benchmarkKey: 'msci-world',
          total: 1,
          funds: [buildRankedEntry()],
        },
      ],
    });
    const entry = response.data[0]?.funds[0];
    assert.ok(entry);

    const ranked = mapRankingEntryToRankedFund(entry);

    assert.equal(ranked.isin, 'ES0000000001');
    assert.equal(ranked.score, 91);
    assert.equal(ranked.riskLevel, 'medium');
    assert.equal(ranked.categoryLabel, 'Índice MSCI World');
  });
});

describe('mapRankingsResponseToGroups / flattenRankingsToRankedFunds', () => {
  it('preserves group ranks and flattens by score globally', () => {
    const response = parseRankingsResponse({
      data: [
        {
          benchmark: 'MSCI World',
          benchmarkKey: 'msci-world',
          total: 1,
          funds: [buildRankedEntry({ score: 80, symbol: 'AAA' })],
        },
        {
          benchmark: 'S&P 500',
          benchmarkKey: 'sp-500',
          total: 1,
          funds: [
            buildRankedEntry({
              rank: 1,
              id: 'sp',
              symbol: 'ZZZ',
              isin: 'ES0000000003',
              score: 95,
              benchmark: 'S&P 500',
            }),
          ],
        },
      ],
    });

    const groups = mapRankingsResponseToGroups(response);
    assert.equal(groups[0]?.funds[0]?.rank, 1);

    const flat = flattenRankingsToRankedFunds(response);
    assert.deepEqual(
      flat.map((fund) => fund.isin),
      ['ES0000000003', 'ES0000000001'],
    );
    assert.equal(flat[0]?.rank, 1);
    assert.equal(flat[1]?.rank, 2);
  });
});
