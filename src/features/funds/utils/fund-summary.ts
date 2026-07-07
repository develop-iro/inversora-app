import type { CatalogFund } from '@/core/domain/catalog';
import type { FeaturedFund } from '@/core/domain/fund';

export type FundSummarySource = FeaturedFund | CatalogFund;

export function getFundScore(fund: FundSummarySource): number {
  return 'inversoraScore' in fund ? fund.inversoraScore : fund.efficiencyScore;
}

export function buildFundCardA11yLabel(fund: FundSummarySource, efficiencyLabel: string): string {
  const score = getFundScore(fund);
  const oneYearReturn = fund.returns.oneYear;
  const returnFragment =
    oneYearReturn === null
      ? ''
      : ` Rentabilidad histórica a un año ${oneYearReturn.toFixed(1).replace('.', ',')} por ciento.`;

  return `${fund.name}. ${fund.categoryLabel}. Temática ${fund.themeLabel}. ${efficiencyLabel}. Score Inversora ${score} sobre 100.${returnFragment}`;
}
