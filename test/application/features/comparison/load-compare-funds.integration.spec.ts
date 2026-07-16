import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseFundDetailResponse } from '@/core/api/parse-fund-detail-response';
import {
  createCompareFundsService,
  mergeCompareEntries,
  resolveIsinsToFetch,
} from '@/features/comparison/services/load-compare-funds.factory';
import { buildFeaturedFund } from '@test/support/fixtures/featured-fund';
import { buildFundDetailPayload } from '@test/support/fixtures/fund-detail-payload';

describe('load-compare-funds application', () => {
  it('merges selection order and only fetches missing entries', () => {
    const detail = parseFundDetailResponse(
      buildFundDetailPayload({
        fund: buildFeaturedFund({ isin: 'IE00LEFT00001' }),
      }),
    );
    const merged = mergeCompareEntries(
      ['IE00LEFT00001', 'IE00RIGHT0001'],
      [{ isin: 'IE00LEFT00001', detail, errorMessage: null }],
    );

    assert.equal(merged.length, 2);
    assert.equal(merged[0]?.detail?.fund.isin, 'IE00LEFT00001');
    assert.equal(merged[1]?.detail, null);
    assert.deepEqual(resolveIsinsToFetch(merged, false), ['IE00RIGHT0001']);
  });

  it('loads details, records not-found errors, and retries failed entries when forced', async () => {
    const detail = parseFundDetailResponse(
      buildFundDetailPayload({
        fund: buildFeaturedFund({ isin: 'IE00LEFT00001' }),
      }),
    );
    let failCalls = 0;

    const service = createCompareFundsService({
      getFundByIsin: async (isin) => {
        if (isin === 'IE00LEFT00001') {
          return detail;
        }

        failCalls += 1;
        if (failCalls === 1) {
          throw new Error('temporary');
        }

        return null;
      },
    });

    const first = await service.loadCompareFunds(['IE00LEFT00001', 'IE00RIGHT0001']);

    assert.equal(first[0]?.detail?.fund.isin, 'IE00LEFT00001');
    assert.equal(first[1]?.detail, null);
    assert.match(first[1]?.errorMessage ?? '', /No se pudo cargar/);

    const second = await service.loadCompareFunds(
      ['IE00LEFT00001', 'IE00RIGHT0001'],
      first,
      { forceFailed: true },
    );

    assert.equal(second[0]?.detail?.fund.isin, 'IE00LEFT00001');
    assert.equal(second[1]?.detail, null);
    assert.equal(failCalls, 2);
  });
});
