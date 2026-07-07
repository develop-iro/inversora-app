/** Freshness tier for a market snapshot shown on fund detail. */
export type FundLiveMarketFreshness = 'live' | 'eod' | 'unavailable';

/** On-demand market snapshot for fund detail screens. */
export type FundLiveMarketSnapshot = {
  isin: string;
  symbol: string;
  price: number | null;
  changePercent: number | null;
  asOf: string;
  freshness: FundLiveMarketFreshness;
  sourceLabel: string;
};
