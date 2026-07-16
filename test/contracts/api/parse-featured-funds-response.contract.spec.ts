import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  parseFeaturedFund,
  parseFeaturedFundsResponse,
} from '@/core/api/parse-featured-funds-response';
import { AppError } from '@/core/errors/app-error';
import { buildFeaturedFund } from '@test/support/fixtures/featured-fund';

describe('parseFeaturedFund', () => {
  it('parses a valid featured fund card', () => {
    const fund = parseFeaturedFund(buildFeaturedFund());

    assert.ok(fund);
    assert.equal(fund.isin, 'IE00B4L5Y983');
    assert.equal(fund.riskLevel, 'medium');
    assert.equal(fund.investmentTheme, 'global-equity');
  });

  it('rejects invalid risk levels', () => {
    assert.equal(parseFeaturedFund(buildFeaturedFund({ riskLevel: 'extreme' as never })), null);
  });
});

describe('parseFeaturedFundsResponse', () => {
  it('parses the featured envelope and drops malformed cards', () => {
    const response = parseFeaturedFundsResponse({
      quarter: '2026-Q1',
      quarterTag: 'Q1 2026',
      periodStart: '2026-01-01',
      periodEnd: '2026-03-31',
      data: [buildFeaturedFund(), { bad: true }],
    });

    assert.equal(response.data.length, 1);
    assert.equal(response.quarterTag, 'Q1 2026');
  });

  it('throws when quarter metadata is missing', () => {
    assert.throws(
      () => parseFeaturedFundsResponse({ data: [] }),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });
});
