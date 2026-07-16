import type { FeaturedFund } from '@/core/domain/fund';

/**
 * Builds a featured-fund shaped object accepted by BFF parsers.
 */
export function buildFeaturedFund(overrides: Partial<FeaturedFund> = {}): FeaturedFund {
  return {
    id: 'msci-world-core',
    isin: 'IE00B4L5Y983',
    symbol: 'IWDA',
    issuer: 'iShares',
    logoUrl: null,
    name: 'MSCI World Index Core',
    categoryLabel: 'Renta Variable Global',
    investmentTheme: 'global-equity',
    themeLabel: 'Multisector global',
    badge: 'Ideal para empezar',
    idealForBeginners: true,
    efficiencyScore: 86,
    terPercent: 0.12,
    riskLevel: 'medium',
    diversification: 'high',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary: 'Diversificación global educativa.',
    featuredReason: 'Bajo coste + alta diversificación',
    isFeatured: true,
    returns: {
      ytd: 4.2,
      oneYear: 11.5,
      threeYear: 28.1,
      asOf: '2026-06-30',
    },
    ...overrides,
  };
}
