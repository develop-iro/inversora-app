import type { FeaturedFund } from '@/core/domain/fund';
import type { FundMarketSnapshot } from '@/core/domain/fund-market';
import type { ScoreBreakdown, ScoringStatus } from '@/core/scoring/types';

export type CatalogFund = FeaturedFund & {
  inversoraScore: number;
  rank?: number;
};

export type FundDetail = {
  fund: FeaturedFund;
  inversoraScore: number;
  rank?: number;
  scoredBreakdown: ScoreBreakdown;
  scoringStatus: ScoringStatus;
  market: FundMarketSnapshot;
};
