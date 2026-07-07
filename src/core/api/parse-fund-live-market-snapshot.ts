import { AppError } from '@/core/errors/app-error';
import type {
  FundLiveMarketFreshness,
  FundLiveMarketSnapshot,
} from '@/core/domain/fund-live-market';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseFreshness(value: unknown): FundLiveMarketFreshness | null {
  if (value === 'live' || value === 'eod' || value === 'unavailable') {
    return value;
  }

  return null;
}

/**
 * Parses and validates the `GET /funds/:isin/market-snapshot` response.
 *
 * @param payload - Raw JSON payload from the API.
 */
export function parseFundLiveMarketSnapshot(
  payload: unknown,
): FundLiveMarketSnapshot {
  if (!isRecord(payload)) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La cotización del fondo no tiene el formato esperado.',
    );
  }

  const {
    isin,
    symbol,
    price,
    changePercent,
    asOf,
    freshness,
    sourceLabel,
  } = payload;

  const parsedFreshness = parseFreshness(freshness);

  if (
    typeof isin !== 'string' ||
    typeof symbol !== 'string' ||
    (typeof price !== 'number' && price !== null) ||
    (typeof changePercent !== 'number' && changePercent !== null) ||
    typeof asOf !== 'string' ||
    parsedFreshness === null ||
    typeof sourceLabel !== 'string'
  ) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La cotización del fondo no tiene el formato esperado.',
    );
  }

  return {
    isin,
    symbol,
    price,
    changePercent,
    asOf,
    freshness: parsedFreshness,
    sourceLabel,
  };
}
