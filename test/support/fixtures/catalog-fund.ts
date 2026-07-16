import type { CatalogFund } from '@/core/domain/catalog';

/**
 * Builds a catalog fund fixture for domain/application specs.
 */
export function buildCatalogFund(overrides: Partial<CatalogFund> = {}): CatalogFund {
  return {
    id: 'fund-a',
    isin: 'IE00TEST0001',
    symbol: 'TEST',
    issuer: null,
    logoUrl: null,
    name: 'Global Index Fund',
    categoryLabel: 'Renta Variable Global',
    investmentTheme: 'global-equity',
    themeLabel: 'Global',
    badge: 'Catalogo',
    idealForBeginners: true,
    efficiencyScore: 85,
    inversoraScore: 85,
    terPercent: 0.12,
    riskLevel: 'medium',
    diversification: 'high',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary: 'Mock fund',
    featuredReason: 'Mock',
    isFeatured: false,
    catalogVisibility: 'visible',
    returns: { ytd: 2, oneYear: 8, threeYear: 20, asOf: '2026-06-30' },
    ...overrides,
  };
}
