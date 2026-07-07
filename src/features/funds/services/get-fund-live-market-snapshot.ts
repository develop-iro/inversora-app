import { apiGet } from '@/core/api/client';
import { parseFundLiveMarketSnapshot } from '@/core/api/parse-fund-live-market-snapshot';
import { shouldUseMockData } from '@/core/config/app-environment';
import type { FundLiveMarketSnapshot } from '@/core/domain/fund-live-market';
import { AppError } from '@/core/errors/app-error';
import { getFundLiveMarketSnapshotMock } from '@/features/funds/mocks/fund-live-market-mock';

/**
 * Fetches an on-demand market snapshot for a fund detail screen.
 *
 * @param isin - Fund ISIN.
 * @param signal - Optional abort signal.
 */
export async function getFundLiveMarketSnapshot(
  isin: string,
  signal?: AbortSignal,
): Promise<FundLiveMarketSnapshot> {
  const normalizedIsin = isin.trim().toUpperCase();

  if (!normalizedIsin) {
    throw new AppError('API_INVALID_RESPONSE', 'ISIN no válido.');
  }

  if (shouldUseMockData()) {
    return getFundLiveMarketSnapshotMock(normalizedIsin);
  }

  try {
    const payload = await apiGet<unknown>({
      path: `/funds/${encodeURIComponent(normalizedIsin)}/market-snapshot`,
      signal,
    });

    return parseFundLiveMarketSnapshot(payload);
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(
          'FUNDS_FETCH_FAILED',
          'No se pudo cargar la cotización del fondo.',
          error,
        );
  }
}
