import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { inferInvestmentThemeFromRankedFund } from './infer-investment-theme';

describe('infer-investment-theme', () => {
  it('classifies broad equity themes from benchmark labels', () => {
    assert.equal(
      inferInvestmentThemeFromRankedFund({
        name: 'Vanguard FTSE All-World UCITS ETF',
        categoryLabel: 'Índice FTSE All-World',
      }),
      'global-equity',
    );
    assert.equal(
      inferInvestmentThemeFromRankedFund({
        name: 'iShares Core S&P 500 UCITS ETF',
        categoryLabel: 'Índice S&P 500',
      }),
      'us-equity',
    );
  });

  it('groups crypto and niche products as sectorial', () => {
    assert.equal(
      inferInvestmentThemeFromRankedFund({
        name: '21Shares 2x Long Dogecoin',
        categoryLabel: 'Índice Dogecoin',
      }),
      'sector-other',
    );
  });
});
