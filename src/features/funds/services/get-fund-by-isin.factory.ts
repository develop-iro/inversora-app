import type { FundDetail } from '@/core/domain/catalog';
import type { HttpGetPort } from '@/core/api/http-get-port';
import { parseFundDetailResponse } from '@/core/api/parse-fund-detail-response';
import { AppError } from '@/core/errors/app-error';
import {
  fetchWithCache,
  FUND_DETAIL_CACHE_TTL_MS,
  invalidateCache,
} from '@/core/query/query-cache';
import { getFundDetailMock } from '@/features/funds/mocks/get-fund-detail-mock';

export { invalidateCache as invalidateFundDetailCache };

/**
 * Dependencies for the fund-detail application service.
 */
export type FundByIsinServiceDeps = {
  apiGet: HttpGetPort;
  shouldUseMockData: () => boolean;
  allowsMockFallback: () => boolean;
};

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
 * Creates the fund-by-ISIN application service without React Native imports.
 *
 * @param deps - HTTP port and environment predicates.
 */
export function createFundByIsinService(deps: FundByIsinServiceDeps) {
  const { apiGet, shouldUseMockData, allowsMockFallback } = deps;

  async function getFundByIsin(
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

    const mockFallback = (): FundDetail | null => {
      if (!allowsMockFallback()) {
        return null;
      }

      return getFundDetailMock(normalizedIsin);
    };

    const loadDetail = async (): Promise<FundDetail | null> => {
      try {
        const payload = await apiGet<unknown>({
          path: `/funds/${encodeURIComponent(normalizedIsin)}`,
          signal,
        });

        if (isNotFoundPayload(payload)) {
          return mockFallback();
        }

        return parseFundDetailResponse(payload);
      } catch (error) {
        if (isHttpNotFoundError(error)) {
          return mockFallback();
        }

        const fallback = mockFallback();

        if (fallback !== null) {
          return fallback;
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

  return { getFundByIsin };
}
