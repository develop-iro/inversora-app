import { explainAssistant } from '@/core/api/assistant-client';
import { allowsMockFallback } from '@/core/config/app-environment';
import type { RankedFund } from '@/core/scoring/types';
import { isQuestionLikeQuery } from '@/features/assistant/utils/search-intent';
import { getRankings } from '@/features/funds/services/get-rankings';
import { RANKINGS_HOME_GROUP_LIMIT } from '@/features/funds/constants/rankings-limits';
import {
  matchHomeSearchAnswer,
  type HomeSearchAnswer,
} from '@/features/onboarding/mocks/home-search-answers-mock';
import {
  CATALOG_SUGGESTIONS_MIN_QUERY_LENGTH,
  matchesFundSearch,
  normalizeFundSearchQuery,
  scoreFundSearchMatch,
} from '@/features/funds/utils/fund-search';

export type HomeRankingEntry = RankedFund & {
  displayRank: number;
  isHighlighted: boolean;
};

export type HomeSearchDefaultResult = {
  kind: 'default';
  funds: HomeRankingEntry[];
  subtitle: string;
};

export type HomeSearchFundMatchResult = {
  kind: 'fund-match';
  query: string;
  funds: HomeRankingEntry[];
  subtitle: string;
};

export type HomeSearchAnswerResult = {
  kind: 'answer';
  query: string;
  answer: HomeSearchAnswer;
  funds: HomeRankingEntry[];
  subtitle: string;
};

export type HomeSearchResult =
  | HomeSearchDefaultResult
  | HomeSearchFundMatchResult
  | HomeSearchAnswerResult;

export type ResolveHomeSearchOptions = {
  limit?: number;
};

/** Teaser rows on mixed home surfaces. */
export const HOME_PREVIEW_RANKING_LIMIT = 3;

/** Full observational ranking on the home Ranking tab. */
export const HOME_FULL_RANKING_LIMIT = 50;

function toRankingEntries(
  funds: RankedFund[],
  highlightedIsin?: string,
): HomeRankingEntry[] {
  return funds.map((fund, index) => ({
    ...fund,
    displayRank: index + 1,
    isHighlighted: highlightedIsin ? fund.isin === highlightedIsin : index === 0,
  }));
}

function buildFundMatchRanking(
  allRanked: RankedFund[],
  query: string,
  limit: number,
): RankedFund[] {
  return allRanked
    .filter((fund) => matchesFundSearch(fund, query))
    .sort((a, b) => {
      const scoreDiff = scoreFundSearchMatch(b, query) - scoreFundSearchMatch(a, query);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return a.rank - b.rank;
    })
    .slice(0, limit);
}

function buildRelatedFunds(
  allRanked: RankedFund[],
  relatedIsin: string | undefined,
  limit: number,
): HomeRankingEntry[] {
  if (!relatedIsin) {
    return toRankingEntries(allRanked.slice(0, limit));
  }

  const related = allRanked.find((fund) => fund.isin === relatedIsin);

  if (!related) {
    return toRankingEntries(allRanked.slice(0, limit));
  }

  const others = allRanked.filter((fund) => fund.isin !== relatedIsin).slice(0, limit - 1);

  return toRankingEntries([related, ...others], relatedIsin);
}

async function resolveAssistantAnswer(
  query: string,
  relatedFundIsin?: string,
): Promise<HomeSearchAnswer> {
  try {
    const response = await explainAssistant({
      surface: 'home',
      message: query,
      locale: 'es',
      ...(relatedFundIsin ? { fund: { isin: relatedFundIsin } } : {}),
    });

    return {
      title: response.title ?? 'Respuesta de SORA',
      body: response.text,
      source: response.source,
      disclaimer: response.disclaimer,
      relatedFundIsin: response.relatedFundIsin,
    };
  } catch (error) {
    if (!allowsMockFallback()) {
      throw error;
    }

    return matchHomeSearchAnswer(query);
  }
}

/** Resolves home search into ranking updates or SORA educational answers. */
export async function resolveHomeSearch(
  query: string,
  options?: ResolveHomeSearchOptions,
): Promise<HomeSearchResult> {
  const limit = options?.limit ?? HOME_PREVIEW_RANKING_LIMIT;

  let allRanked: RankedFund[];

  try {
    allRanked = await getRankings({ limit: RANKINGS_HOME_GROUP_LIMIT });
  } catch {
    allRanked = [];
  }

  const trimmedQuery = query.trim();
  const normalizedQuery = normalizeFundSearchQuery(trimmedQuery);

  if (!normalizedQuery) {
    return {
      kind: 'default',
      funds: toRankingEntries(allRanked.slice(0, limit)),
      subtitle:
        limit > HOME_PREVIEW_RANKING_LIMIT
          ? 'Observa el ranking completo según el Score Inversora. Orden educativo, no recomendación personalizada.'
          : 'Descubre los fondos mejor puntuados según el Score Inversora.',
    };
  }

  const fundMatches = buildFundMatchRanking(allRanked, trimmedQuery, limit);
  const questionLike = isQuestionLikeQuery(trimmedQuery);
  const hasFundMatches =
    fundMatches.length > 0 && normalizedQuery.length >= CATALOG_SUGGESTIONS_MIN_QUERY_LENGTH;

  if (hasFundMatches && !questionLike) {
    const bestMatch = fundMatches[0];

    return {
      kind: 'fund-match',
      query: trimmedQuery,
      funds: toRankingEntries(fundMatches, bestMatch?.isin),
      subtitle: `Coincidencias para «${trimmedQuery}». La mejor match aparece destacada.`,
    };
  }

  if (questionLike || !hasFundMatches) {
    const bestMatchIsin = fundMatches[0]?.isin;
    const answer = await resolveAssistantAnswer(trimmedQuery, bestMatchIsin);

    return {
      kind: 'answer',
      query: trimmedQuery,
      answer,
      funds: buildRelatedFunds(allRanked, answer.relatedFundIsin, limit),
      subtitle: answer.relatedFundIsin
        ? 'Respuesta orientativa y fondos relacionados en el ranking.'
        : 'Respuesta orientativa. Explora el ranking mientras decides qué profundizar.',
    };
  }

  return {
    kind: 'fund-match',
    query: trimmedQuery,
    funds: toRankingEntries(fundMatches, fundMatches[0]?.isin),
    subtitle: `Coincidencias para «${trimmedQuery}».`,
  };
}
