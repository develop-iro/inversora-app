import type { FundHistoricalReturns } from '@/core/scoring/types';

import { EMPTY_FUND_HISTORICAL_RETURNS } from '@/core/api/parse-fund-return-snapshot';

const MOCK_FUND_RETURNS_BY_ISIN: Record<
  string,
  Pick<FundHistoricalReturns, 'ytd' | 'oneYear' | 'threeYear'>
> = {
  IE00B4L5Y983: { ytd: 6.2, oneYear: 11.4, threeYear: 24.8 },
  IE00B5BMR087: { ytd: 7.1, oneYear: 13.2, threeYear: 31.5 },
  IE00B1YZSC51: { ytd: 5.8, oneYear: 10.9, threeYear: 22.1 },
  IE00B3F81R35: { ytd: 4.9, oneYear: 9.6, threeYear: 19.4 },
  US78462F1030: { ytd: 8.1, oneYear: 12.5, threeYear: 28.2 },
};

/**
 * Returns deterministic mock historical returns for catalog and featured cards.
 *
 * @param isin - Fund ISIN.
 */
export function resolveMockFundReturns(isin: string): FundHistoricalReturns {
  const snapshot = MOCK_FUND_RETURNS_BY_ISIN[isin];

  if (snapshot === undefined) {
    return EMPTY_FUND_HISTORICAL_RETURNS;
  }

  return {
    ...snapshot,
    asOf: '2026-06-27',
  };
}
