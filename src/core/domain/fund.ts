export type RiskLevel = 'low' | 'medium' | 'high';
export type DiversificationLevel = 'low' | 'medium' | 'high';

export type QuarterTag = `Q${1 | 2 | 3 | 4} ${number}`;

export type FeaturedFund = {
  id: string;
  isin: string;
  name: string;
  categoryLabel: string;
  badge: string;
  idealForBeginners: boolean;
  efficiencyScore: number;
  terPercent: number;
  riskLevel: RiskLevel;
  diversification: DiversificationLevel;
  quarterTag: QuarterTag;
  periodStart: string;
  periodEnd: string;
  benefitSummary: string;
  featuredReason: string;
  isFeatured: boolean;
};

/** Raw fund metrics used as input to the scoring engine. */
export type FundScoringInput = {
  isin: string;
  name: string;
  categoryLabel: string;
  riskLevel: RiskLevel;
  terPercent: number;
  /** Mock/dev override when deterministic breakdown is not yet wired. */
  referenceScore?: number;
};
