import type { FeaturedFund } from '@/core/domain/fund';
import type { FundDetailProfile } from '@/core/domain/fund-detail-profile';
import type { FundMarketSnapshot } from '@/core/domain/fund-market';
import type { ScoreBreakdown, ScoringStatus } from '@/core/scoring/types';

/** Whether a fund may appear in the public catalog (HU-04, HU-37). */
export type CatalogVisibility = 'visible' | 'quarantined' | 'blocked';

export type CatalogFund = FeaturedFund & {
  inversoraScore: number;
  rank?: number;
  catalogVisibility: CatalogVisibility;
};

export type FundDetail = {
  fund: FeaturedFund;
  inversoraScore: number;
  rank?: number;
  scoredBreakdown: ScoreBreakdown;
  scoringStatus: ScoringStatus;
  market: FundMarketSnapshot;
  profile: FundDetailProfile;
};
