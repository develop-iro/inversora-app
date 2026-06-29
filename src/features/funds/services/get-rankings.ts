import { apiGet } from '@/core/api/client';
import { shouldUseMockData } from '@/core/config/app-environment';
import {
  flattenRankingsToRankedFunds,
  parseRankingsResponse,
} from '@/core/api/parse-rankings-response';
import { AppError } from '@/core/errors/app-error';
import type { RankedFund } from '@/core/scoring/types';
import { getRankingsMock } from '@/features/funds/mocks/get-rankings-mock';

export type GetRankingsOptions = {
  benchmark?: string;
  limit?: number;
  signal?: AbortSignal;
};

let rankingsCache: RankedFund[] | null = null;
let rankingsPromise: Promise<RankedFund[]> | null = null;

function applyRankingsLimit(
  funds: RankedFund[],
  limit: number | undefined,
): RankedFund[] {
  if (limit === undefined) {
    return funds;
  }

  return funds.slice(0, limit);
}

async function fetchRankingsFromApi(
  options?: GetRankingsOptions,
): Promise<RankedFund[]> {
  const payload = await apiGet<unknown>({
    path: '/rankings',
    searchParams: {
      benchmark: options?.benchmark,
      limit: options?.benchmark !== undefined ? options?.limit : undefined,
    },
    signal: options?.signal,
  });

  const response = parseRankingsResponse(payload);
  const ranked = flattenRankingsToRankedFunds(response);

  return applyRankingsLimit(ranked, options?.limit);
}

/**
 * Clears the in-memory rankings cache (retry flows).
 */
export function resetRankingsCache(): void {
  rankingsCache = null;
  rankingsPromise = null;
}

/**
 * Returns funds ranked by Score Inversora via `GET /rankings`.
 *
 * @param options - Optional benchmark filter, global limit, and abort signal.
 */
export async function getRankings(
  options?: GetRankingsOptions,
): Promise<RankedFund[]> {
  const { benchmark, limit, signal } = options ?? {};

  if (shouldUseMockData()) {
    return getRankingsMock(benchmark, limit);
  }

  if (benchmark !== undefined) {
    try {
      return await fetchRankingsFromApi({ benchmark, limit, signal });
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new AppError(
            'RANKINGS_FETCH_FAILED',
            'No se pudo cargar el ranking de fondos.',
            error,
          );
    }
  }

  if (rankingsCache !== null) {
    return applyRankingsLimit(rankingsCache, limit);
  }

  rankingsPromise ??= (async () => {
    try {
      const loaded = await fetchRankingsFromApi({ signal });
      rankingsCache = loaded;
      return loaded;
    } catch (error) {
      rankingsPromise = null;
      throw error instanceof AppError
        ? error
        : new AppError(
            'RANKINGS_FETCH_FAILED',
            'No se pudo cargar el ranking de fondos.',
            error,
          );
    }
  })();

  const ranked = await rankingsPromise;
  return applyRankingsLimit(ranked, limit);
}
