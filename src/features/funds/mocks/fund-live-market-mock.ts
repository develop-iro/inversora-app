import type { FundLiveMarketSnapshot } from '@/core/domain/fund-live-market';

/**
 * Returns a deterministic live market snapshot for mock mode.
 *
 * @param isin - Fund ISIN.
 */
export function getFundLiveMarketSnapshotMock(
  isin: string,
): FundLiveMarketSnapshot {
  return {
    isin,
    symbol: isin.slice(-4),
    price: 740.93,
    changePercent: 1.63788,
    asOf: '2026-06-29T15:30:00.000Z',
    freshness: 'live',
    sourceLabel: 'Financial Modeling Prep',
  };
}
