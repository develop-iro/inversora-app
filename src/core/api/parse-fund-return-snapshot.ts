import type { FundHistoricalReturns } from '@/core/scoring/types';

/** Empty historical returns snapshot for list cards without price history. */
export const EMPTY_FUND_HISTORICAL_RETURNS: FundHistoricalReturns = {
  ytd: null,
  oneYear: null,
  threeYear: null,
  asOf: null,
};

/**
 * Parses a fund return snapshot from API payloads.
 *
 * @param value - Raw `returns` object from the API.
 */
export function parseFundReturnSnapshot(
  value: unknown,
): FundHistoricalReturns | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { ytd, oneYear, threeYear, asOf } = value as Record<string, unknown>;

  if (
    (typeof ytd !== 'number' && ytd !== null) ||
    (typeof oneYear !== 'number' && oneYear !== null) ||
    (typeof threeYear !== 'number' && threeYear !== null) ||
    (typeof asOf !== 'string' && asOf !== null)
  ) {
    return null;
  }

  return { ytd, oneYear, threeYear, asOf };
}

/**
 * Resolves returns from an API payload, falling back to empty values.
 *
 * @param value - Raw `returns` object from the API.
 */
export function resolveFundReturnSnapshotFromApi(
  value: unknown,
): FundHistoricalReturns {
  return parseFundReturnSnapshot(value) ?? EMPTY_FUND_HISTORICAL_RETURNS;
}
