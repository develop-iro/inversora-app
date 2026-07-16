import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseFundDetailResponse } from '@/core/api/parse-fund-detail-response';
import { createFavoriteCatalogFundsService } from '@/features/funds/services/load-favorite-catalog-funds.factory';
import { buildFeaturedFund } from '@test/support/fixtures/featured-fund';
import { buildFundDetailPayload } from '@test/support/fixtures/fund-detail-payload';

describe('load-favorite-catalog-funds application', () => {
  it('returns an empty list for an empty selection', async () => {
    const service = createFavoriteCatalogFundsService({
      getFundByIsin: async () => {
        throw new Error('should not fetch');
      },
    });

    assert.deepEqual(await service.loadFavoriteCatalogFunds([]), []);
  });

  it('hydrates catalog cards in selection order and skips missing or failing ISINs', async () => {
    const left = parseFundDetailResponse(
      buildFundDetailPayload({
        fund: buildFeaturedFund({ isin: 'IE00LEFT00001', name: 'Left Fund' }),
        inversoraScore: 91,
      }),
    );
    const right = parseFundDetailResponse(
      buildFundDetailPayload({
        fund: buildFeaturedFund({ isin: 'IE00RIGHT0001', name: 'Right Fund' }),
        inversoraScore: 77,
      }),
    );

    const service = createFavoriteCatalogFundsService({
      getFundByIsin: async (isin) => {
        if (isin === 'IE00LEFT00001') {
          return left;
        }

        if (isin === 'IE00MISSING01') {
          return null;
        }

        if (isin === 'IE00FAIL00001') {
          throw new Error('network down');
        }

        if (isin === 'IE00RIGHT0001') {
          return right;
        }

        return null;
      },
    });

    const funds = await service.loadFavoriteCatalogFunds([
      'IE00LEFT00001',
      'IE00MISSING01',
      'IE00FAIL00001',
      'IE00RIGHT0001',
    ]);

    assert.deepEqual(
      funds.map((fund) => fund.isin),
      ['IE00LEFT00001', 'IE00RIGHT0001'],
    );
    assert.equal(funds[0]?.inversoraScore, 91);
    assert.equal(funds[0]?.catalogVisibility, 'visible');
  });
});
