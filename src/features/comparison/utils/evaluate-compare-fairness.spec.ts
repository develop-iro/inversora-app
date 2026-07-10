import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { evaluateCompareFairness } from './evaluate-compare-fairness';

function buildDetail(
  isin: string,
  benchmark: string,
  currency: string,
  vehicle: string,
) {
  return {
    fund: {
      isin,
      name: `Fund ${isin}`,
      symbol: isin.slice(0, 3),
      categoryLabel: 'Global',
      themeLabel: 'Equity',
      terPercent: 0.2,
      riskLevel: 'medium' as const,
      inversoraScore: 80,
      rank: 1,
      catalogVisibility: 'visible' as const,
    },
    inversoraScore: 80,
    rank: 1,
    profile: {
      benchmark,
      currencyNote: `* Calculada en ${currency}`,
      summaryRows: [
        { id: 'currency', label: 'Divisa', value: currency },
        { id: 'vehicle', label: 'Vehículo', value: vehicle },
      ],
    },
    scoreBreakdown: [],
    returns: null,
    performanceHistory: [],
    exposure: null,
    distributors: [],
    dataQuality: { warnings: [] },
  };
}

describe('evaluateCompareFairness', () => {
  it('returns fair when benchmarks and currencies match', () => {
    const result = evaluateCompareFairness([
      buildDetail('IE00A', 'MSCI World', 'EUR', 'ETF'),
      buildDetail('IE00B', 'MSCI World', 'EUR', 'ETF'),
    ]);

    assert.equal(result.isFair, true);
    assert.equal(result.warnings.length, 0);
  });

  it('warns when benchmarks differ', () => {
    const result = evaluateCompareFairness([
      buildDetail('IE00A', 'MSCI World', 'EUR', 'ETF'),
      buildDetail('IE00B', 'S&P 500', 'EUR', 'ETF'),
    ]);

    assert.equal(result.isFair, false);
    assert.ok(result.warnings.some((warning) => warning.includes('benchmarks')));
  });
});
