import type { FeaturedFund } from '@/core/domain/fund';
import type { ScoreBreakdown, ScoringStatus } from '@/core/scoring/types';

export type CatalogFund = FeaturedFund & {
  invesoraScore: number;
  rank?: number;
};

export type FundDetail = {
  fund: FeaturedFund;
  invesoraScore: number;
  rank?: number;
  scoredBreakdown: ScoreBreakdown;
  scoringStatus: ScoringStatus;
};
