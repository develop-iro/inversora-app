import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  parseInvestmentTheme,
  resolveInvestmentThemeLabel,
} from '@/core/domain/investment-theme';

describe('parseInvestmentTheme', () => {
  it('accepts canonical theme codes', () => {
    assert.equal(parseInvestmentTheme('global-equity'), 'global-equity');
    assert.equal(parseInvestmentTheme('technology'), 'technology');
  });

  it('rejects unknown or non-string values', () => {
    assert.equal(parseInvestmentTheme('crypto'), null);
    assert.equal(parseInvestmentTheme(12), null);
    assert.equal(parseInvestmentTheme(null), null);
  });
});

describe('resolveInvestmentThemeLabel', () => {
  it('returns the Spanish display label', () => {
    assert.equal(resolveInvestmentThemeLabel('esg'), 'ESG y sostenibilidad');
  });
});
