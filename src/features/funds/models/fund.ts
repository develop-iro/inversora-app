export type RiskLevel = "low" | "medium" | "high";
export type DiversificationLevel = "low" | "medium" | "high";

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
