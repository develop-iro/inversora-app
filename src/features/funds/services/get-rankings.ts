import { apiGet } from '@/core/api/client';
import { shouldUseMockData } from '@/core/config/app-environment';
import { createRankingsService } from '@/features/funds/services/get-rankings.factory';

export {
  flattenRankingGroupsToRankedFunds,
  RANKINGS_BENCHMARK_DETAIL_LIMIT,
  RANKINGS_DEFAULT_GROUPS_LIMIT,
  RANKINGS_GROUP_INDEX_LIMIT,
  RANKINGS_HOME_GROUP_LIMIT,
  type ApiRankingsMeta,
  type BenchmarkRankingGroup,
  type GetRankingsOptions,
} from '@/features/funds/services/get-rankings.factory';

const rankingsService = createRankingsService({
  apiGet,
  shouldUseMockData,
});

/**
 * Clears the in-memory rankings cache (retry flows).
 */
export const resetRankingsCache = rankingsService.resetRankingsCache;

/**
 * Returns cached rankings metadata from the latest unfiltered `GET /rankings` call.
 */
export const getCachedRankingsMeta = rankingsService.getCachedRankingsMeta;

/**
 * Returns benchmark-scoped ranking groups via `GET /rankings`.
 *
 * @param options - Optional benchmark filter, per-group limit, and abort signal.
 */
export const getRankingsGrouped = rankingsService.getRankingsGrouped;

/**
 * Returns funds ranked by Score Inversora via `GET /rankings`.
 *
 * @param options - Optional benchmark filter, global limit, and abort signal.
 */
export const getRankings = rankingsService.getRankings;
