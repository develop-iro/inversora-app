import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseFundDetailResponse } from '@/core/api/parse-fund-detail-response';
import { AppError } from '@/core/errors/app-error';
import { buildFundDetailPayload } from '@test/support/fixtures/fund-detail-payload';

describe('parseFundDetailResponse', () => {
  it('parses a complete BFF fund detail payload', () => {
    const detail = parseFundDetailResponse(buildFundDetailPayload());

    assert.equal(detail.fund.isin, 'IE00B4L5Y983');
    assert.equal(detail.inversoraScore, 86);
    assert.equal(detail.rank, 1);
    assert.equal(detail.scoringStatus, 'ok');
    assert.equal(detail.scoredBreakdown.length, 6);
    assert.equal(detail.market.regions.length, 3);
    assert.equal(detail.profile.benchmark, 'MSCI World');
    assert.equal(detail.profile.isIndexed, true);
  });

  it('throws when the payload is not an object', () => {
    assert.throws(
      () => parseFundDetailResponse(null),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });

  it('throws when required sections are missing or incomplete', () => {
    assert.throws(
      () => parseFundDetailResponse(buildFundDetailPayload({ scoredBreakdown: [] })),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );

    assert.throws(
      () => parseFundDetailResponse(buildFundDetailPayload({ scoringStatus: 'unknown' })),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );

    assert.throws(
      () =>
        parseFundDetailPayloadMissingMarket(),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });
});

function parseFundDetailPayloadMissingMarket() {
  const payload = buildFundDetailPayload();
  delete (payload as { market?: unknown }).market;
  return parseFundDetailResponse(payload);
}
