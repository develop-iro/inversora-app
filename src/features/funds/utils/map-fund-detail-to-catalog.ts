import type { CatalogFund, FundDetail } from '@/core/domain/catalog';

/**
 * Maps a fund detail payload to the catalog card shape.
 *
 * @param detail - Aggregated fund detail from `GET /funds/:isin`.
 */
export function mapFundDetailToCatalogFund(detail: FundDetail): CatalogFund {
  return {
    ...detail.fund,
    inversoraScore: detail.inversoraScore,
    rank: detail.rank,
    catalogVisibility: 'visible',
  };
}
