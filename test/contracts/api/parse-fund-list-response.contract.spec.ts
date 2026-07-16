import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseFundListResponse } from '@/core/api/parse-fund-list-response';
import { AppError } from '@/core/errors/app-error';
import { buildApiFund, buildFundListPayload } from '@test/support/fixtures/api-fund';

describe('parseFundListResponse', () => {
  it('parses a valid paginated catalog payload', () => {
    const response = parseFundListResponse(
      buildFundListPayload([buildApiFund(), buildApiFund({ id: 'fund-b', isin: 'IE00TEST0002' })]),
    );

    assert.equal(response.data.length, 2);
    assert.deepEqual(response.meta, {
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    });
    assert.equal(response.data[0]?.isin, 'IE00TEST0001');
  });

  it('drops malformed items and funds without ISIN', () => {
    const payload = buildFundListPayload([
      buildApiFund(),
      { not: 'a-fund' },
      buildApiFund({ id: 'fund-no-isin', isin: null }),
    ]);

    const response = parseFundListResponse(payload);
    assert.equal(response.data.length, 1);
    assert.equal(response.data[0]?.id, 'fund-a');
  });

  it('throws when the envelope is invalid', () => {
    assert.throws(
      () => parseFundListResponse(null),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
    assert.throws(
      () => parseFundListResponse({ data: [] }),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });

  it('throws when pagination meta is missing fields', () => {
    assert.throws(
      () =>
        parseFundListResponse({
          data: [buildApiFund()],
          meta: { page: 1, limit: 20 },
        }),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });
});
