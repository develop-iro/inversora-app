import { useCallback, useEffect, useState } from 'react';

import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import type { FeaturedFund } from '@/core/domain/fund';
import type { InvestmentNewsItem } from '@/core/domain/investment-news';
import {
  getFeaturedFundsForCarousel,
  getFeaturedFundsMockFallback,
} from '@/features/funds/services/get-featured-funds';
import {
  getRankingsGrouped,
  getCachedRankingsMeta,
  resetRankingsCache,
} from '@/features/funds/services/get-rankings';
import { CATALOG_SEARCH_DEBOUNCE_MS } from '@/features/funds/utils/fund-search';
import { allowsMockFallback } from '@/core/config/app-environment';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { HOME_INVESTMENT_NEWS_MOCK } from '@/features/onboarding/mocks/home-investment-news-mock';
import {
  resolveHomeSearch,
  HOME_FULL_RANKING_LIMIT,
  type HomeSearchResult,
} from '@/features/onboarding/services/resolve-home-search';
import {
  getInvestmentNews,
  type GetInvestmentNewsOptions,
} from '@/features/onboarding/services/get-investment-news';
import {
  resolveRankingEligibleFundTotal,
} from '@/features/onboarding/utils/build-ranking-theme-options';

export type HomeSectionLoadState = 'loading' | 'ready' | 'error' | 'empty';

export type UseHomeScreenDataResult = {
  searchQuery: string;
  hasQuery: boolean;
  handleSearchChange: (query: string) => void;
  featuredFunds: FeaturedFund[];
  featuredState: HomeSectionLoadState;
  newsItems: InvestmentNewsItem[];
  newsState: HomeSectionLoadState;
  rankingGroups: BenchmarkRankingGroup[];
  rankingEligibleTotal: number;
  activeRanking: HomeSearchResult | null;
  rankingState: HomeSectionLoadState;
  isRefreshing: boolean;
  refreshHome: () => Promise<void>;
  retryFeatured: () => Promise<void>;
  retryNews: () => Promise<void>;
  retryRanking: () => Promise<void>;
  retryActiveRanking: () => Promise<void>;
};

async function loadFeaturedFunds(): Promise<{
  funds: FeaturedFund[];
  state: HomeSectionLoadState;
}> {
  try {
    const funds = await getFeaturedFundsForCarousel();

    if (funds.length === 0) {
      return { funds: [], state: 'empty' };
    }

    return { funds, state: 'ready' };
  } catch {
    if (!allowsMockFallback()) {
      return { funds: [], state: 'error' };
    }

    const fallback = getFeaturedFundsMockFallback();

    if (fallback.length > 0) {
      return { funds: fallback, state: 'ready' };
    }

    return { funds: [], state: 'error' };
  }
}

async function loadNewsItems(
  options?: GetInvestmentNewsOptions,
): Promise<{ items: InvestmentNewsItem[]; state: HomeSectionLoadState }> {
  try {
    const items = await getInvestmentNews(options);

    if (items.length === 0) {
      return { items: [], state: 'empty' };
    }

    return { items, state: 'ready' };
  } catch {
    if (!allowsMockFallback()) {
      return { items: [], state: 'error' };
    }

    const fallback = [...HOME_INVESTMENT_NEWS_MOCK].slice(0, options?.limit ?? 4);

    if (fallback.length > 0) {
      return { items: fallback, state: 'ready' };
    }

    return { items: [], state: 'error' };
  }
}

async function loadRankingGroups(): Promise<{
  groups: BenchmarkRankingGroup[];
  state: HomeSectionLoadState;
}> {
  try {
    const groups = await getRankingsGrouped();

    if (groups.length === 0) {
      return { groups: [], state: 'empty' };
    }

    return { groups, state: 'ready' };
  } catch {
    return { groups: [], state: 'error' };
  }
}

async function loadDefaultRanking(): Promise<{
  result: HomeSearchResult | null;
  state: HomeSectionLoadState;
}> {
  try {
    const result = await resolveHomeSearch('', { limit: HOME_FULL_RANKING_LIMIT });

    if (result.funds.length === 0) {
      return { result, state: 'empty' };
    }

    return { result, state: 'ready' };
  } catch {
    return { result: null, state: 'error' };
  }
}

/**
 * Loads and resolves all data sources for the minimal home screen.
 */
export function useHomeScreenData(): UseHomeScreenDataResult {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<HomeSearchResult | null>(null);
  const [searchState, setSearchState] = useState<HomeSectionLoadState>('ready');
  const [defaultRanking, setDefaultRanking] = useState<HomeSearchResult | null>(null);
  const [rankingGroups, setRankingGroups] = useState<BenchmarkRankingGroup[]>([]);
  const [rankingEligibleTotal, setRankingEligibleTotal] = useState(0);
  const [rankingState, setRankingState] = useState<HomeSectionLoadState>('loading');
  const [featuredFunds, setFeaturedFunds] = useState<FeaturedFund[]>([]);
  const [featuredState, setFeaturedState] = useState<HomeSectionLoadState>('loading');
  const [newsItems, setNewsItems] = useState<InvestmentNewsItem[]>([]);
  const [newsState, setNewsState] = useState<HomeSectionLoadState>('loading');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedQuery = useDebouncedValue(searchQuery, CATALOG_SEARCH_DEBOUNCE_MS);
  const hasQuery = searchQuery.trim().length > 0;

  const reloadFeatured = useCallback(async () => {
    setFeaturedState('loading');
    const { funds, state } = await loadFeaturedFunds();
    setFeaturedFunds(funds);
    setFeaturedState(state);
  }, []);

  const reloadNews = useCallback(async () => {
    setNewsState('loading');
    const { items, state } = await loadNewsItems({ limit: 4 });
    setNewsItems(items);
    setNewsState(state);
  }, []);

  const reloadRanking = useCallback(async () => {
    setRankingState('loading');
    resetRankingsCache();
    const [{ groups, state: groupsState }, ranking] = await Promise.all([
      loadRankingGroups(),
      loadDefaultRanking(),
    ]);
    setRankingGroups(groups);
    setRankingEligibleTotal(
      resolveRankingEligibleFundTotal(groups, getCachedRankingsMeta()),
    );
    setDefaultRanking(ranking.result);
    setRankingState(
      groupsState === 'error' || ranking.state === 'error'
        ? 'error'
        : groupsState === 'empty' || ranking.state === 'empty'
          ? 'empty'
          : 'ready',
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const featured = await loadFeaturedFunds();
      if (!cancelled) {
        setFeaturedFunds(featured.funds);
        setFeaturedState(featured.state);
      }
    })();

    void (async () => {
      const news = await loadNewsItems({ limit: 4 });
      if (!cancelled) {
        setNewsItems(news.items);
        setNewsState(news.state);
      }
    })();

    void (async () => {
      const [{ groups, state: groupsState }, ranking] = await Promise.all([
        loadRankingGroups(),
        loadDefaultRanking(),
      ]);

      if (!cancelled) {
        setRankingGroups(groups);
        setRankingEligibleTotal(
          resolveRankingEligibleFundTotal(groups, getCachedRankingsMeta()),
        );
        setDefaultRanking(ranking.result);
        setRankingState(
          groupsState === 'error' || ranking.state === 'error'
            ? 'error'
            : groupsState === 'empty' || ranking.state === 'empty'
              ? 'empty'
              : 'ready',
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setSearchState('loading');

      try {
        const result = await resolveHomeSearch(debouncedQuery, { limit: HOME_FULL_RANKING_LIMIT });

        if (!cancelled) {
          setSearchResult(result);
          setSearchState(result.funds.length > 0 || result.kind === 'answer' ? 'ready' : 'empty');
        }
      } catch {
        if (!cancelled) {
          setSearchResult(null);
          setSearchState('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResult(null);
      setSearchState('ready');
    }
  }, []);

  const refreshHome = useCallback(async () => {
    setIsRefreshing(true);
    resetRankingsCache();

    await Promise.all([reloadFeatured(), reloadNews(), reloadRanking()]);

    if (searchQuery.trim()) {
      setSearchState('loading');
      try {
        const result = await resolveHomeSearch(searchQuery, { limit: HOME_FULL_RANKING_LIMIT });
        setSearchResult(result);
        setSearchState(result.funds.length > 0 || result.kind === 'answer' ? 'ready' : 'empty');
      } catch {
        setSearchResult(null);
        setSearchState('error');
      }
    }

    setIsRefreshing(false);
  }, [reloadFeatured, reloadNews, reloadRanking, searchQuery]);

  const retryActiveRanking = useCallback(async () => {
    if (!searchQuery.trim()) {
      await reloadRanking();
      return;
    }

    setSearchState('loading');

    try {
      const result = await resolveHomeSearch(searchQuery, { limit: HOME_FULL_RANKING_LIMIT });
      setSearchResult(result);
      setSearchState(result.funds.length > 0 || result.kind === 'answer' ? 'ready' : 'empty');
    } catch {
      setSearchResult(null);
      setSearchState('error');
    }
  }, [reloadRanking, searchQuery]);

  const activeRanking = hasQuery ? searchResult : defaultRanking;
  const activeRankingState = hasQuery ? searchState : rankingState;

  return {
    searchQuery,
    hasQuery,
    handleSearchChange,
    featuredFunds,
    featuredState,
    newsItems,
    newsState,
    rankingGroups,
    rankingEligibleTotal,
    activeRanking,
    rankingState: activeRankingState,
    isRefreshing,
    refreshHome,
    retryFeatured: reloadFeatured,
    retryNews: reloadNews,
    retryRanking: reloadRanking,
    retryActiveRanking,
  };
}
