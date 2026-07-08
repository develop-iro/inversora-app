import type { FundDetail } from '@/core/domain/catalog';

import { apiGet } from '@/core/api/client';
import { shouldUseMockData } from '@/core/config/app-environment';
import { parseFundDetailResponse } from '@/core/api/parse-fund-detail-response';
import { AppError } from '@/core/errors/app-error';
import {
  fetchWithCache,
  FUND_DETAIL_CACHE_TTL_MS,
  invalidateCache,
} from '@/core/query/query-cache';
import { getFundDetailMock } from '@/features/funds/mocks/get-fund-detail-mock';

export { invalidateCache as invalidateFundDetailCache };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Detects NestJS error envelopes accidentally returned with a success HTTP status.
 */
function isNotFoundPayload(payload: unknown): boolean {
  return isRecord(payload) && payload.statusCode === 404;
}

function isHttpNotFoundError(error: unknown): boolean {
  return error instanceof AppError && error.status === 404;
}

/**
 * Fetches the aggregated fund detail for a given ISIN from `GET /funds/:isin`.
 *
 * @param isin - Fund ISIN (case-insensitive).
 * @param signal - Optional abort signal for in-flight requests.
 */
export async function getFundByIsin(
  isin: string,
  signal?: AbortSignal,
): Promise<FundDetail | null> {
  const normalizedIsin = isin.trim().toUpperCase();

  if (!normalizedIsin) {
    return null;
  }

  if (shouldUseMockData()) {
    return getFundDetailMock(normalizedIsin);
  }

  const loadDetail = async (): Promise<FundDetail | null> => {
    try {
      const payload = await apiGet<unknown>({
        path: `/funds/${encodeURIComponent(normalizedIsin)}`,
        signal,
      });

      if (isNotFoundPayload(payload)) {
        return null;
      }

      return parseFundDetailResponse(payload);
    } catch (error) {
      if (isHttpNotFoundError(error)) {
        return null;
      }

      throw error instanceof AppError
        ? error
        : new AppError('FUNDS_FETCH_FAILED', 'No se pudo cargar la ficha del fondo.', error);
    }
  };

  if (signal) {
    return loadDetail();
  }

  return fetchWithCache(`fund:${normalizedIsin}`, FUND_DETAIL_CACHE_TTL_MS, loadDetail);
}
