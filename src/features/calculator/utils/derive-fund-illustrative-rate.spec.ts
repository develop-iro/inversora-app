import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FundDetail } from '@/core/domain/catalog';

import {
  annualizeTotalReturn,
  deriveIllustrativeFundRate,
} from './derive-fund-illustrative-rate';

function buildDetail(overrides: Partial<FundDetail> = {}): FundDetail {
  const base: FundDetail = {
    fund: {
      id: 'fund-1',
      isin: 'US1234567890',
      symbol: 'TEST',
      issuer: 'Issuer',
      logoUrl: null,
      name: 'Test Fund',
      categoryLabel: 'Índice global',
      investmentTheme: 'global-equity',
      themeLabel: 'Global',
      badge: 'Indexado',
      idealForBeginners: true,
      efficiencyScore: 70,
      terPercent: 0.2,
      riskLevel: 'medium',
      diversification: 'high',
      quarterTag: 'Q2 2026',
      periodStart: '2026-04-01',
      periodEnd: '2026-06-30',
      benefitSummary: 'Summary',
      featuredReason: 'Reason',
      isFeatured: false,
      returns: {
        ytd: 4.5,
        oneYear: 12.4,
        threeYear: null,
        asOf: '2026-06-30',
      },
    },
    inversoraScore: 70,
    scoredBreakdown: [],
    scoringStatus: 'ok',
    market: {
      performanceByTimeframe: {
        ytd: { timeframe: 'ytd', points: [], asOf: '2026-06-30T00:00:00.000Z', sourceLabel: 'FMP' },
        '1y': { timeframe: '1y', points: [], asOf: '2026-06-30T00:00:00.000Z', sourceLabel: 'FMP' },
        '3y': { timeframe: '3y', points: [], asOf: '2026-06-30T00:00:00.000Z', sourceLabel: 'FMP' },
        '5y': { timeframe: '5y', points: [], asOf: '2026-06-30T00:00:00.000Z', sourceLabel: 'FMP' },
        max: { timeframe: 'max', points: [], asOf: '2026-06-30T00:00:00.000Z', sourceLabel: 'FMP' },
      },
      regions: [],
      stabilityLabel: 'Volatilidad media',
    },
    profile: {
      asOf: '2026-06-30T00:00:00.000Z',
      sourceLabel: 'Financial Modeling Prep',
      description: 'Desc',
      manager: 'Manager',
      benchmark: 'MSCI World',
      isIndexed: true,
      fundAum: '100M',
      inceptionDate: '01/01/2020',
      summaryRows: [],
      feeRows: [],
      documents: [],
      returnsByPeriod: [
        { id: 'ytd', label: 'YTD', percent: 4.5 },
        { id: '1y', label: '1 año', percent: 12.4 },
        { id: '3y', label: '3 años', percent: null },
        { id: '5y', label: '5 años', percent: null },
      ],
      returnsByYear: [],
      currencyNote: 'EUR',
      methodNote: 'Note',
      ratiosByHorizon: { '12m': [], '3y': [], '5y': [] },
      exposureByTab: {
        sectorial: [],
        regional: [],
        assetAllocation: [],
        capitalization: [],
        portfolio: [],
      },
      distributors: [],
    },
  };

  return {
    ...base,
    ...overrides,
    fund: { ...base.fund, ...overrides.fund },
    market: { ...base.market, ...overrides.market },
    profile: { ...base.profile, ...overrides.profile },
  };
}

describe('derive-fund-illustrative-rate', () => {
  it('annualizes multi-year total returns', () => {
    assert.ok(Math.abs(annualizeTotalReturn(21, 3) - 6.56) < 0.01);
  });

  it('falls back to fund return snapshots when chart series are empty', () => {
    const rate = deriveIllustrativeFundRate(buildDetail());

    assert.ok(rate);
    assert.equal(rate.timeframe, '1y');
    assert.equal(rate.grossRatePercent, 12.4);
    assert.equal(rate.annualRatePercent, 12.2);
    assert.equal(rate.isPartialHistory, false);
  });

  it('uses partial ytd history when one-year return is unavailable', () => {
    const rate = deriveIllustrativeFundRate(
      buildDetail({
        fund: {
          ...buildDetail().fund,
          returns: {
            ytd: 6,
            oneYear: null,
            threeYear: null,
            asOf: '2026-06-30',
          },
        },
      }),
    );

    assert.ok(rate);
    assert.equal(rate.timeframe, 'ytd');
    assert.equal(rate.isPartialHistory, true);
  });

  it('returns null when no eligible history exists', () => {
    const base = buildDetail();

    const rate = deriveIllustrativeFundRate({
      ...base,
      fund: {
        ...base.fund,
        returns: {
          ytd: null,
          oneYear: null,
          threeYear: null,
          asOf: null,
        },
      },
      profile: {
        ...base.profile,
        returnsByPeriod: [
          { id: 'ytd', label: 'YTD', percent: null },
          { id: '1y', label: '1 año', percent: null },
          { id: '3y', label: '3 años', percent: null },
          { id: '5y', label: '5 años', percent: null },
        ],
      },
    });

    assert.equal(rate, null);
  });
});
