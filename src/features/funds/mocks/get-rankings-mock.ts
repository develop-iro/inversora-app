import type { RankedFund } from '@/core/scoring/types';

import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import { resolveMockFundReturns } from '@/features/funds/mocks/mock-fund-returns';
import { scoreFund } from '@/core/scoring/score-fund';

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

  const ranked = visibleFunds
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

  if (limit === undefined) {
    return ranked;
  }

  return ranked.slice(0, limit);
}
