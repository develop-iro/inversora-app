import { scoreFund } from '@/core/scoring/score-fund';
import type { RankedFund } from '@/core/scoring/types';
import { RANKING_SOURCES_MOCK } from '@/features/funds/mocks/ranking-sources-mock';

export type GetRankingsOptions = {
  limit?: number;
};

function toRankedFunds(): RankedFund[] {
  return RANKING_SOURCES_MOCK.map((source) => scoreFund(source))
    .sort((a, b) => b.score - a.score)
    .map((fund, index) => ({
      ...fund,
      rank: index + 1,
    }));
}

/** Returns funds ranked by Score Inversora (mock pipeline). */
export async function getRankings(options?: GetRankingsOptions): Promise<RankedFund[]> {
  const ranked = toRankedFunds();
  const limit = options?.limit;

  if (limit === undefined) {
    return ranked;
  }

  return ranked.slice(0, limit);
}
