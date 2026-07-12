import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import type { RankedFund } from '@/core/scoring/types';

import {
  buildRankingThemeOptionsFromGroups,
  getRankingFundsForTheme,
  resolveRankingEligibleFundTotal,
  toHomeRankingEntries,
} from './build-ranking-theme-options';

function buildFund(name: string, benchmark: string, score: number, rank: number): RankedFund {
  return {
    rank,
    isin: `ES0${rank}0000000`,
    name,
    categoryLabel: `Índice ${benchmark}`,
    score,
    riskLevel: 'medium',
    terPercent: 0.2,
    status: 'ok',
    breakdown: [],
    returns: { ytd: null, oneYear: null, threeYear: null, asOf: null },
  };
}

describe('build-ranking-theme-options', () => {
  it('groups ranking filters by investment theme instead of benchmark peer group', () => {
    const groups: BenchmarkRankingGroup[] = [
      {
        benchmark: 'Dogecoin',
        benchmarkKey: 'dogecoin',
        total: 1,
        funds: [buildFund('21Shares 2x Long Dogecoin', 'Dogecoin', 31, 1)],
      },
      {
        benchmark: 'S&P 500',
        benchmarkKey: 's&p 500',
        total: 1,
        funds: [buildFund('Vanguard S&P 500 UCITS ETF', 'S&P 500', 70, 1)],
      },
    ];

    const options = buildRankingThemeOptionsFromGroups(groups);

    assert.equal(options.length, 2);
    assert.deepEqual(
      options.map((option) => option.label),
      ['Renta variable USA', 'Sectorial'],
    );
  });

  it('filters funds across benchmark groups by theme', () => {
    const groups: BenchmarkRankingGroup[] = [
      {
        benchmark: 'MSCI World',
        benchmarkKey: 'msci world',
        total: 1,
        funds: [buildFund('iShares MSCI World', 'MSCI World', 68, 1)],
      },
      {
        benchmark: 'S&P 500',
        benchmarkKey: 's&p 500',
        total: 1,
        funds: [buildFund('Vanguard S&P 500 UCITS ETF', 'S&P 500', 70, 1)],
      },
    ];

    const usaFunds = getRankingFundsForTheme(groups, 'us-equity');

    assert.equal(usaFunds.length, 1);
    assert.equal(usaFunds[0]?.name, 'Vanguard S&P 500 UCITS ETF');
  });

  it('resolves total eligible funds from rankings metadata', () => {
    const groups: BenchmarkRankingGroup[] = [
      {
        benchmark: 'MSCI World',
        benchmarkKey: 'msci world',
        total: 120,
        funds: [buildFund('iShares MSCI World', 'MSCI World', 68, 1)],
      },
    ];

    assert.equal(resolveRankingEligibleFundTotal(groups, { totalEligibleFunds: 850 } as never), 850);
    assert.equal(resolveRankingEligibleFundTotal(groups), 120);
  });

  it('sums benchmark totals for the Todos card when metadata is absent', () => {
    const groups: BenchmarkRankingGroup[] = [
      {
        benchmark: 'S&P 500',
        benchmarkKey: 's&p 500',
        total: 2,
        funds: [
          buildFund('Vanguard S&P 500 UCITS ETF', 'S&P 500', 70, 1),
          buildFund('iShares Core S&P 500', 'S&P 500', 68, 2),
        ],
      },
      {
        benchmark: 'MSCI World',
        benchmarkKey: 'msci world',
        total: 3,
        funds: [buildFund('iShares MSCI World', 'MSCI World', 68, 1)],
      },
    ];

    assert.equal(resolveRankingEligibleFundTotal(groups), 5);
    assert.equal(buildRankingThemeOptionsFromGroups(groups)[0]?.fundCount, 3);
  });
});
