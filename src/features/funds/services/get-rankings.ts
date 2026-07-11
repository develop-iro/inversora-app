import { apiGet } from '@/core/api/client';
import { shouldUseMockData } from '@/core/config/app-environment';
import {
  flattenRankingsToRankedFunds,
  mapRankingsResponseToGroups,
  parseRankingsResponse,
  type BenchmarkRankingGroup,
} from '@/core/api/parse-rankings-response';
import { AppError } from '@/core/errors/app-error';
import type { RankedFund } from '@/core/scoring/types';
import { getRankingsGroupedMock, getRankingsMock } from '@/features/funds/mocks/get-rankings-mock';

export type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';

export type GetRankingsOptions = {
  benchmark?: string;
  limit?: number;
  signal?: AbortSignal;
};

let rankingsCache: RankedFund[] | null = null;
let rankingsGroupedCache: BenchmarkRankingGroup[] | null = null;
let rankingsPromise: Promise<RankedFund[]> | null = null;
let rankingsGroupedPromise: Promise<BenchmarkRankingGroup[]> | null = null;

function applyRankingsLimit(
  funds: RankedFund[],
  limit: number | undefined,
): RankedFund[] {
  if (limit === undefined) {
    return funds;
  }

  return funds.slice(0, limit);
}

async function fetchRankingsPayload(
  options?: GetRankingsOptions,
): Promise<ReturnType<typeof parseRankingsResponse>> {
  const payload = await apiGet<unknown>({
    path: '/rankings',
    searchParams: {
      benchmark: options?.benchmark,
      limit: options?.benchmark !== undefined ? options?.limit : undefined,
    },
    signal: options?.signal,
  });

  return parseRankingsResponse(payload);
}

async function fetchRankingsGroupedFromApi(
  options?: GetRankingsOptions,
): Promise<BenchmarkRankingGroup[]> {
  const response = await fetchRankingsPayload(options);
  return mapRankingsResponseToGroups(response);
}

async function fetchRankingsFromApi(
  options?: GetRankingsOptions,
): Promise<RankedFund[]> {
  const response = await fetchRankingsPayload(options);

  if (options?.benchmark !== undefined) {
    const groups = mapRankingsResponseToGroups(response);
    const groupFunds = groups[0]?.funds ?? [];
    return applyRankingsLimit(groupFunds, options?.limit);
  }

  const ranked = flattenRankingsToRankedFunds(response);
  return applyRankingsLimit(ranked, options?.limit);
}

/**
 * Clears the in-memory rankings cache (retry flows).
 */
export function resetRankingsCache(): void {
  rankingsCache = null;
  rankingsGroupedCache = null;
  rankingsPromise = null;
  rankingsGroupedPromise = null;
}

/**
 * Returns benchmark-scoped ranking groups via `GET /rankings`.
 *
 * @param options - Optional benchmark filter, per-group limit, and abort signal.
 */
export async function getRankingsGrouped(
  options?: GetRankingsOptions,
): Promise<BenchmarkRankingGroup[]> {
  const { benchmark, limit, signal } = options ?? {};

  if (shouldUseMockData()) {
    return getRankingsGroupedMock(benchmark, limit);
  }

  if (benchmark !== undefined) {
    try {
      return await fetchRankingsGroupedFromApi({ benchmark, limit, signal });
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

  if (rankingsGroupedCache !== null) {
    return rankingsGroupedCache;
  }

  rankingsGroupedPromise ??= (async () => {
    try {
      const loaded = await fetchRankingsGroupedFromApi({ signal });
      rankingsGroupedCache = loaded;
      return loaded;
    } catch (error) {
      rankingsGroupedPromise = null;
      throw error instanceof AppError
        ? error
        : new AppError(
            'RANKINGS_FETCH_FAILED',
            'No se pudo cargar el ranking de fondos.',
            error,
          );
    }
  })();

  return rankingsGroupedPromise;
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
