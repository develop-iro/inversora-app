import type { FundScoringInput, RiskLevel } from '@/core/domain/fund';

export type ScoringStatus = 'ok' | 'warning' | 'quarantined';

export type FundHistoricalReturns = {
  ytd: number | null;
  oneYear: number | null;
  threeYear: number | null;
  asOf: string | null;
};

export type ScoreCriterionId =
  | 'ter'
  | 'tracking'
  | 'aum'
  | 'age'
  | 'consistency'
  | 'dataQuality';

export type ScoreCriterionResult = {
  id: ScoreCriterionId;
  label: string;
  points: number;
  maxPoints: number;
};

export type ScoreBreakdown = ScoreCriterionResult[];

export type ScoredFund = {
  isin: string;
  name: string;
  categoryLabel: string;
  score: number;
  riskLevel: RiskLevel;
  terPercent: number;
  status: ScoringStatus;
  breakdown: ScoreBreakdown;
};

export type RankedFund = ScoredFund & {
  rank: number;
  returns: FundHistoricalReturns;
};

export type { FundScoringInput };
