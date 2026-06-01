import type { FundDetail } from '@/core/domain/catalog';
import { scoreFund } from '@/core/scoring/score-fund';

import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import { RANKING_SOURCES_MOCK } from '@/features/funds/mocks/ranking-sources-mock';
import { getRankings } from '@/features/funds/services/get-rankings';

export async function getFundByIsin(isin: string): Promise<FundDetail | null> {
  const normalizedIsin = isin.trim().toUpperCase();
  const fund = CATALOG_FUNDS_MOCK.find((entry) => entry.isin.toUpperCase() === normalizedIsin);

  if (!fund) {
    return null;
  }

  const rankingSource = RANKING_SOURCES_MOCK.find(
    (entry) => entry.isin.toUpperCase() === normalizedIsin,
  );

  const scored = scoreFund(
    rankingSource ?? {
      isin: fund.isin,
      name: fund.name,
      categoryLabel: fund.categoryLabel,
      riskLevel: fund.riskLevel,
      terPercent: fund.terPercent,
      referenceScore: fund.efficiencyScore,
    },
  );
  const rankings = await getRankings();
  const rankEntry = rankings.find((entry) => entry.isin.toUpperCase() === normalizedIsin);

  return {
    fund,
    invesoraScore: scored.score,
    rank: rankEntry?.rank,
    scoredBreakdown: scored.breakdown,
    scoringStatus: scored.status,
  };
}
