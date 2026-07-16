import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseFundDetailResponse } from '@/core/api/parse-fund-detail-response';
import { buildCompareTableRows } from '@/features/comparison/utils/build-compare-table-rows';
import { buildFeaturedFund } from '@test/support/fixtures/featured-fund';
import { buildFundDetailPayload } from '@test/support/fixtures/fund-detail-payload';

describe('buildCompareTableRows', () => {
  it('returns an empty list when there are no details', () => {
    assert.deepEqual(buildCompareTableRows([]), []);
  });

  it('builds score and TER rows with lower-is-better emphasis on TER', () => {
    const withRatios = (detail: ReturnType<typeof parseFundDetailResponse>) => ({
      ...detail,
      profile: {
        ...detail.profile,
        ratiosByHorizon: {
          '12m': [{ id: 'trackingError', label: 'Tracking error', value: '0,12%' }],
          '3y': [],
          '5y': [],
        },
      },
    });

    const left = withRatios(
      parseFundDetailResponse(
        buildFundDetailPayload({
          fund: buildFeaturedFund({ isin: 'IE00LEFT00001', symbol: 'LEFT', terPercent: 0.1 }),
          inversoraScore: 90,
        }),
      ),
    );
    const right = withRatios(
      parseFundDetailResponse(
        buildFundDetailPayload({
          fund: buildFeaturedFund({ isin: 'IE00RIGHT0001', symbol: 'RGHT', terPercent: 0.3 }),
          inversoraScore: 80,
        }),
      ),
    );

    const rows = buildCompareTableRows([left, right]);
    const scoreRow = rows.find((row) => row.id === 'score');
    const terRow = rows.find((row) => row.id === 'ter');

    assert.ok(scoreRow);
    assert.ok(terRow);
    assert.equal(terRow.emphasizeLower, true);
    assert.equal(scoreRow.values[0]?.displayValue, '90');
    assert.equal(terRow.values[0]?.displayValue, '0,10 %');
    assert.equal(terRow.values[1]?.displayValue, '0,30 %');
  });
});
