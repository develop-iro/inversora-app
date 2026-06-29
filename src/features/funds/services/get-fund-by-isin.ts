import type { FundDetail } from '@/core/domain/catalog';

import { apiGet } from '@/core/api/client';
import { shouldUseMockData } from '@/core/config/app-environment';
import { parseFundDetailResponse } from '@/core/api/parse-fund-detail-response';
import { AppError } from '@/core/errors/app-error';
import { getFundDetailMock } from '@/features/funds/mocks/get-fund-detail-mock';

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

  try {
    const payload = await apiGet<unknown>({
      path: `/funds/${encodeURIComponent(normalizedIsin)}`,
      signal,
    });

    return parseFundDetailResponse(payload);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) {
      return null;
    }

    throw error instanceof AppError
      ? error
      : new AppError('FUNDS_FETCH_FAILED', 'No se pudo cargar la ficha del fondo.', error);
  }
}
