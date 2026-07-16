import { explainAssistant } from '@/core/api/assistant-client';
import { allowsMockFallback } from '@/core/config/app-environment';
import { getRankingsGrouped } from '@/features/funds/services/get-rankings';
import { createHomeSearchService } from '@/features/onboarding/services/resolve-home-search.factory';

export {
  HOME_FULL_RANKING_LIMIT,
  HOME_PREVIEW_RANKING_LIMIT,
  type HomeRankingEntry,
  type HomeSearchAnswerResult,
  type HomeSearchDefaultResult,
  type HomeSearchFundMatchResult,
  type HomeSearchResult,
  type ResolveHomeSearchOptions,
} from '@/features/onboarding/services/resolve-home-search.factory';

const homeSearchService = createHomeSearchService({
  getRankingsGrouped,
  explainAssistant,
  allowsMockFallback,
});

/**
 * Resolves home search into ranking updates or SORA educational answers.
 *
 * @param query - Raw search text from the home search field.
 * @param options - Optional result limit.
 */
export const resolveHomeSearch = homeSearchService.resolveHomeSearch;
