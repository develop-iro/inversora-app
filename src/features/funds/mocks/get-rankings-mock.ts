import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import type { RankedFund } from '@/core/scoring/types';

import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import { resolveMockFundReturns } from '@/features/funds/mocks/mock-fund-returns';
import { scoreFund } from '@/core/scoring/score-fund';

function buildRankedFundsFromCatalog(benchmark?: string): RankedFund[] {
  const needle = benchmark?.trim().toLowerCase();

  const visibleFunds = CATALOG_FUNDS_MOCK.filter(
    (fund) => fund.catalogVisibility === 'visible',
  ).filter((fund) => {
    if (needle === undefined || needle.length === 0) {
      return true;
    }

    return (
      fund.categoryLabel.toLowerCase().includes(needle) ||
      fund.name.toLowerCase().includes(needle) ||
      fund.themeLabel.toLowerCase().includes(needle)
    );
  });

  return visibleFunds
    .map((fund) => {
      const scored = scoreFund({
        isin: fund.isin,
        name: fund.name,
        categoryLabel: fund.categoryLabel,
        riskLevel: fund.riskLevel,
        terPercent: fund.terPercent,
        referenceScore: fund.inversoraScore,
      });

      return {
        ...scored,
        rank: 0,
        returns: fund.returns ?? resolveMockFundReturns(fund.isin),
      } satisfies RankedFund;
    })
    .sort((left, right) => right.score - left.score)
    .map((fund, index) => ({
      ...fund,
      rank: index + 1,
    }));
}

/**
 * Returns mock benchmark-scoped ranking groups from the local catalog.
 *
 * @param benchmark - Optional benchmark filter.
 * @param limit - Optional maximum rows per group.
 */
export function getRankingsGroupedMock(
  benchmark?: string,
  limit?: number,
): BenchmarkRankingGroup[] {
  const ranked = buildRankedFundsFromCatalog(benchmark);
  const groups = new Map<string, RankedFund[]>();

  for (const fund of ranked) {
    const benchmarkLabel = fund.categoryLabel.replace(/^Índice\s+/i, '').trim();
    const benchmarkKey = benchmarkLabel.toLowerCase();
    const existing = groups.get(benchmarkKey) ?? [];
    existing.push(fund);
    groups.set(benchmarkKey, existing);
  }

  return [...groups.entries()].map(([benchmarkKey, funds]) => {
    const sorted = [...funds]
      .sort((left, right) => right.score - left.score)
      .map((fund, index) => ({ ...fund, rank: index + 1 }));
    const limited = limit === undefined ? sorted : sorted.slice(0, limit);

    return {
      benchmark: benchmarkKey,
      benchmarkKey,
      total: sorted.length,
      funds: limited,
    };
  });
}

/**
 * Returns a deterministic rankings list from local catalog mocks.
 *
 * @param benchmark - Optional benchmark/category filter.
 * @param limit - Optional maximum number of rows.
 */
export function getRankingsMock(
  benchmark?: string,
  limit?: number,
): RankedFund[] {
  const ranked = buildRankedFundsFromCatalog(benchmark);

  if (limit === undefined) {
    return ranked;
  }

  return ranked.slice(0, limit);
}