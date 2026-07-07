import type { FundDetail } from '@/core/domain/catalog';
import type { FeaturedFund } from '@/core/domain/fund';

import { scoreFund } from '@/core/scoring/score-fund';
import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import { getFundDetailProfileMock } from '@/features/funds/mocks/fund-detail-profile-mock';
import { getFundMarketSnapshotMock } from '@/features/funds/mocks/fund-market-mock';

/**
 * Builds an aggregated fund detail payload from local educational mocks.
 *
 * @param isin - Fund ISIN.
 */
export function getFundDetailMock(isin: string): FundDetail | null {
  const normalizedIsin = isin.trim().toUpperCase();

  if (normalizedIsin.length === 0) {
    return null;
  }

  const catalogFund = CATALOG_FUNDS_MOCK.find(
    (fund) =>
      fund.isin.toUpperCase() === normalizedIsin &&
      fund.catalogVisibility === 'visible',
  );

  if (catalogFund === undefined) {
    return null;
  }

  const fund: FeaturedFund = {
    id: catalogFund.id,
    isin: catalogFund.isin,
    symbol: catalogFund.symbol,
    issuer: catalogFund.issuer,
    logoUrl: catalogFund.logoUrl,
    name: catalogFund.name,
    categoryLabel: catalogFund.categoryLabel,
    themeLabel: catalogFund.themeLabel,
    badge: catalogFund.badge,
    idealForBeginners: catalogFund.idealForBeginners,
    efficiencyScore: catalogFund.efficiencyScore,
    terPercent: catalogFund.terPercent,
    riskLevel: catalogFund.riskLevel,
    diversification: catalogFund.diversification,
    quarterTag: catalogFund.quarterTag,
    periodStart: catalogFund.periodStart,
    periodEnd: catalogFund.periodEnd,
    benefitSummary: catalogFund.benefitSummary,
    featuredReason: catalogFund.featuredReason,
    isFeatured: catalogFund.isFeatured,
    returns: catalogFund.returns,
  };

  const scored = scoreFund({
    isin: fund.isin,
    name: fund.name,
    categoryLabel: fund.categoryLabel,
    riskLevel: fund.riskLevel,
    terPercent: fund.terPercent,
    referenceScore: catalogFund.inversoraScore,
  });

  return {
    fund,
    inversoraScore: catalogFund.inversoraScore,
    rank: catalogFund.rank,
    scoredBreakdown: scored.breakdown,
    scoringStatus: scored.status,
    market: getFundMarketSnapshotMock(fund.isin),
    profile: getFundDetailProfileMock(fund),
  };
}
