import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CatalogFund } from '@/core/domain/catalog';
import {
  buildCatalogPreviewServiceFilters,
  countCatalogFunds,
  filterCatalogFunds,
} from '@/features/funds/utils/filter-catalog-funds';
import { DEFAULT_CATALOG_FILTERS } from '@/features/funds/types/fund-catalog-filters';

function buildFund(overrides: Partial<CatalogFund>): CatalogFund {
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

describe('filterCatalogFunds', () => {
  const funds = [
    buildFund({ isin: 'IE00GLOBAL01', name: 'Global Core', inversoraScore: 90 }),
    buildFund({
      isin: 'IE00USA0001',
      name: 'USA Core',
      categoryLabel: 'Renta Variable USA',
      investmentTheme: 'us-equity',
      idealForBeginners: false,
      inversoraScore: 74,
      riskLevel: 'high',
      terPercent: 0.3,
      returns: { ytd: 1, oneYear: 4, threeYear: 12, asOf: '2026-06-30' },
    }),
    buildFund({
      isin: 'IE00HIDDEN1',
      name: 'Hidden Fund',
      catalogVisibility: 'blocked',
    }),
  ];

  it('counts draft filters from an in-memory catalog slice', () => {
    const filters = buildCatalogPreviewServiceFilters({
      ...DEFAULT_CATALOG_FILTERS,
      categoryLabel: 'global-equity',
      maxTerPercent: 0.2,
      minScore: 80,
      idealForBeginnersOnly: true,
    });

    assert.equal(countCatalogFunds(funds, filters), 1);
  });

  it('matches search, risk and historical return filters', () => {
    const result = filterCatalogFunds(funds, {
      query: 'usa',
      riskLevel: 'high',
      minReturnPercent: 3,
      returnPeriod: '1y',
      sortBy: 'score',
      sortOrder: 'desc',
    });

    assert.deepEqual(
      result.map((fund) => fund.isin),
      ['IE00USA0001'],
    );
  });

  it('sorts preview results with the selected sort option', () => {
    const result = filterCatalogFunds(funds, {
      sortBy: 'ter',
      sortOrder: 'asc',
    });

    assert.deepEqual(
      result.map((fund) => fund.isin),
      ['IE00GLOBAL01', 'IE00USA0001'],
    );
  });
});
