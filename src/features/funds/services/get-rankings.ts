import { apiGet } from '@/core/api/client';
import { shouldUseMockData } from '@/core/config/app-environment';
import {
  flattenRankingsToRankedFunds,
  mapRankingsResponseToGroups,
  parseRankingsResponse,
  type ApiRankingsMeta,
  type BenchmarkRankingGroup,
} from '@/core/api/parse-rankings-response';
import { AppError } from '@/core/errors/app-error';
import type { RankedFund } from '@/core/scoring/types';
import { getRankingsGroupedMock, getRankingsMock } from '@/features/funds/mocks/get-rankings-mock';
import {
  RANKINGS_DEFAULT_GROUPS_LIMIT,
  RANKINGS_HOME_GROUP_LIMIT,
} from '@/features/funds/constants/rankings-limits';

export {
  RANKINGS_BENCHMARK_DETAIL_LIMIT,
  RANKINGS_DEFAULT_GROUPS_LIMIT,
  RANKINGS_GROUP_INDEX_LIMIT,
  RANKINGS_HOME_GROUP_LIMIT,
} from '@/features/funds/constants/rankings-limits';

export type { ApiRankingsMeta, BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';

export type GetRankingsOptions = {
  benchmark?: string;
  limit?: number;
  groupsLimit?: number;
  signal?: AbortSignal;
};

let rankingsCache: RankedFund[] | null = null;
let rankingsGroupedCache: BenchmarkRankingGroup[] | null = null;
let rankingsMetaCache: ApiRankingsMeta | null = null;
let sharedRankingsPayloadPromise: Promise<
  ReturnType<typeof parseRankingsResponse>
> | null = null;

function applyRankingsLimit(
  funds: RankedFund[],
  limit: number | undefined,
): RankedFund[] {
  if (limit === undefined) {
    return funds;
  }

  return funds.slice(0, limit);
}

function normalizeUnfilteredRankingsOptions(
  options?: GetRankingsOptions,
): Required<Pick<GetRankingsOptions, 'limit' | 'groupsLimit'>> &
  Pick<GetRankingsOptions, 'signal'> {
  return {
    limit: options?.limit ?? RANKINGS_HOME_GROUP_LIMIT,
    groupsLimit: options?.groupsLimit ?? RANKINGS_DEFAULT_GROUPS_LIMIT,
    signal: options?.signal,
  };
}

async function fetchRankingsPayload(
  options?: GetRankingsOptions,
): Promise<ReturnType<typeof parseRankingsResponse>> {
  const payload = await apiGet<unknown>({
    path: '/rankings',
    searchParams: {
      benchmark: options?.benchmark,
      limit: options?.limit,
      groupsLimit: options?.groupsLimit,
    },
    signal: options?.signal,
  });

  return parseRankingsResponse(payload);
}

/**
 * Fetches the unfiltered home rankings payload once and shares it across callers.
 *
 * @param options - Optional per-group limit, groups limit, and abort signal.
 */
async function fetchSharedUnfilteredRankingsPayload(
  options?: GetRankingsOptions,
): Promise<ReturnType<typeof parseRankingsResponse>> {
  if (options?.benchmark !== undefined) {
    return fetchRankingsPayload(options);
  }

  if (sharedRankingsPayloadPromise !== null) {
    return sharedRankingsPayloadPromise;
  }

  const normalized = normalizeUnfilteredRankingsOptions(options);

  sharedRankingsPayloadPromise = fetchRankingsPayload(normalized).catch((error) => {
    sharedRankingsPayloadPromise = null;
    throw error;
  });

  return sharedRankingsPayloadPromise;
}

async function fetchRankingsGroupedFromApi(
  options?: GetRankingsOptions,
): Promise<BenchmarkRankingGroup[]> {
  const response = await fetchSharedUnfilteredRankingsPayload(options);
  rankingsMetaCache = response.meta ?? null;
  return mapRankingsResponseToGroups(response);
}

async function fetchRankingsFromApi(
  options?: GetRankingsOptions,
): Promise<RankedFund[]> {
  const response = await fetchSharedUnfilteredRankingsPayload(options);

  if (options?.benchmark !== undefined) {
    const groups = mapRankingsResponseToGroups(response);
    const groupFunds = groups[0]?.funds ?? [];
    return applyRankingsLimit(groupFunds, options?.limit);
  }

  const ranked = flattenRankingsToRankedFunds(response);
  return applyRankingsLimit(ranked, options?.limit);
}

/**
 * Flattens benchmark groups into a cross-benchmark ranked list for home search.
 *
 * @param groups - Benchmark-scoped ranking groups.
 */
export function flattenRankingGroupsToRankedFunds(
  groups: readonly BenchmarkRankingGroup[],
): RankedFund[] {
  const entries = groups.flatMap((group) => group.funds);

  const sorted = [...entries].sort((left, right) => {
    const scoreDifference = right.score - left.score;

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.isin.localeCompare(right.isin);
  });

  return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/**
 * Clears the in-memory rankings cache (retry flows).
 */
export function resetRankingsCache(): void {
  rankingsCache = null;
  rankingsGroupedCache = null;
  rankingsMetaCache = null;
  sharedRankingsPayloadPromise = null;
}

/**
 * Returns cached rankings metadata from the latest unfiltered `GET /rankings` call.
 */
export function getCachedRankingsMeta(): ApiRankingsMeta | null {
  return rankingsMetaCache;
}

/**
 * Returns benchmark-scoped ranking groups via `GET /rankings`.
 *
 * @param options - Optional benchmark filter, per-group limit, and abort signal.
 */
export async function getRankingsGrouped(
  options?: GetRankingsOptions,
): Promise<BenchmarkRankingGroup[]> {
  const { benchmark, limit, groupsLimit, signal } = options ?? {};

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

  try {
    const loaded = await fetchRankingsGroupedFromApi({
      signal,
      limit: limit ?? RANKINGS_HOME_GROUP_LIMIT,
      groupsLimit: groupsLimit ?? RANKINGS_DEFAULT_GROUPS_LIMIT,
    });
    rankingsGroupedCache = loaded;
    rankingsCache = flattenRankingGroupsToRankedFunds(loaded);
    return loaded;
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

/**
 * Returns funds ranked by Score Inversora via `GET /rankings`.
 *
 * @param options - Optional benchmark filter, global limit, and abort signal.
 */
export async function getRankings(
  options?: GetRankingsOptions,
): Promise<RankedFund[]> {
  const { benchmark, limit, groupsLimit, signal } = options ?? {};

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

  try {
    await getRankingsGrouped({
      signal,
      limit: limit ?? RANKINGS_HOME_GROUP_LIMIT,
      groupsLimit: groupsLimit ?? RANKINGS_DEFAULT_GROUPS_LIMIT,
    });
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(
          'RANKINGS_FETCH_FAILED',
          'No se pudo cargar el ranking de fondos.',
          error,
        );
  }

  const ranked = rankingsCache ?? [];
  return applyRankingsLimit(ranked, limit);
}
