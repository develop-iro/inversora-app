import type { RiskLevel } from '@/core/domain/fund';

export type FundCatalogFilters = {
  query?: string;
  riskLevel?: RiskLevel | 'all';
  categoryLabel?: string | 'all';
  maxTerPercent?: number | null;
  minScore?: number | null;
  idealForBeginnersOnly?: boolean;
};
