import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CatalogFund } from '@/core/domain/catalog';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import {
  countCatalogFunds,
  filterCatalogFunds,
  matchesCatalogFundFilters,
} from '@/features/funds/utils/filter-catalog-funds';

function buildCatalogFund(overrides: Partial<CatalogFund> = {}): CatalogFund {
  return {
    id: 'fund-1',
    isin: 'IE00B4L5Y983',
    symbol: 'IWDA',
    issuer: null,
    logoUrl: null,
    name: 'iShares Core MSCI World UCITS ETF',
    categoryLabel: 'Índice MSCI World',
    investmentTheme: 'global-equity',
    themeLabel: 'Renta variable global',
    badge: 'En catálogo',
    idealForBeginners: true,
    efficiencyScore: 82,
    terPercent: 0.2,
    riskLevel: 'medium',
    diversification: 'high',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary: 'Fondo global diversificado.',
    featuredReason: 'Alta puntuación',
    isFeatured: false,
    returns: {
      ytd: 4,
      oneYear: 8,
      threeYear: 22,
      asOf: '2026-03-31',
    },
    inversoraScore: 82,
    catalogVisibility: 'visible',
    ...overrides,
  };
}

describe('matchesCatalogFundFilters', () => {
  it('matches all funds when filters are empty', () => {
    const fund = buildCatalogFund();

    assert.equal(matchesCatalogFundFilters(fund, undefined), true);
    assert.equal(matchesCatalogFundFilters(fund, {}), true);
  });

  it('filters by investment theme category id', () => {
    const fund = buildCatalogFund({ investmentTheme: 'global-equity' });

    assert.equal(
      matchesCatalogFundFilters(fund, { categoryLabel: 'global-equity' }),
      true,
    );
    assert.equal(
      matchesCatalogFundFilters(fund, { categoryLabel: 'technology' }),
      false,
    );
  });

  it('filters by risk level client-side', () => {
    const fund = buildCatalogFund({ riskLevel: 'low' });

    assert.equal(matchesCatalogFundFilters(fund, { riskLevel: 'low' }), true);
    assert.equal(matchesCatalogFundFilters(fund, { riskLevel: 'high' }), false);
    assert.equal(matchesCatalogFundFilters(fund, { riskLevel: 'all' }), true);
  });

  it('filters by TER, score, beginners and return thresholds', () => {
    const fund = buildCatalogFund({
      terPercent: 0.18,
      inversoraScore: 75,
      idealForBeginners: true,
      returns: { ytd: 2, oneYear: 6, threeYear: 18, asOf: '2026-03-31' },
    });

    assert.equal(
      matchesCatalogFundFilters(fund, {
        maxTerPercent: 0.2,
        minScore: 70,
        idealForBeginnersOnly: true,
        minReturnPercent: 5,
        returnPeriod: '1y',
      }),
      true,
    );

    assert.equal(
      matchesCatalogFundFilters(fund, {
        maxTerPercent: 0.15,
      }),
      false,
    );

    assert.equal(
      matchesCatalogFundFilters(fund, {
        minScore: 80,
      }),
      false,
    );

    assert.equal(
      matchesCatalogFundFilters(fund, {
        idealForBeginnersOnly: true,
        minScore: 10,
      }),
      true,
    );

    assert.equal(
      matchesCatalogFundFilters(fund, {
        idealForBeginnersOnly: true,
        minScore: 10,
        minReturnPercent: 10,
        returnPeriod: '1y',
      }),
      false,
    );
  });

  it('matches free-text search across name and symbol', () => {
    const fund = buildCatalogFund({
      name: 'Vanguard FTSE All-World',
      symbol: 'VWRL',
      categoryLabel: 'Renta Variable Global',
    });

    assert.equal(matchesCatalogFundFilters(fund, { query: 'vanguard' }), true);
    assert.equal(matchesCatalogFundFilters(fund, { query: 'vwrl' }), true);
    assert.equal(matchesCatalogFundFilters(fund, { query: 'msci' }), false);
  });
});

describe('countCatalogFunds', () => {
  const funds = [
    buildCatalogFund({ isin: 'IE00A', inversoraScore: 90, riskLevel: 'low' }),
    buildCatalogFund({ isin: 'IE00B', inversoraScore: 70, riskLevel: 'medium' }),
    buildCatalogFund({ isin: 'IE00C', inversoraScore: 50, riskLevel: 'high' }),
  ];

  it('returns zero for an empty catalog slice', () => {
    assert.equal(countCatalogFunds([], { minScore: 60 }), 0);
  });

  it('counts funds matching combined draft filters', () => {
    const filters: FundCatalogFilters = {
      minScore: 60,
      riskLevel: 'medium',
    };

    assert.equal(countCatalogFunds(funds, filters), 1);
    assert.deepEqual(
      filterCatalogFunds(funds, filters).map((fund) => fund.isin),
      ['IE00B'],
    );
  });

  it('counts all funds when only search query is empty', () => {
    assert.equal(countCatalogFunds(funds, { query: '' }), 3);
  });
});
