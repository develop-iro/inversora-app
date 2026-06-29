import { useCallback, useEffect, useState } from 'react';

import type { FeaturedFund } from '@/core/domain/fund';
import type { InvestmentNewsItem } from '@/core/domain/investment-news';
import {
  getFeaturedFundsForCarousel,
  getFeaturedFundsMockFallback,
} from '@/features/funds/services/get-featured-funds';
import { CATALOG_SEARCH_DEBOUNCE_MS } from '@/features/funds/utils/fund-search';
import { HOME_INVESTMENT_NEWS_MOCK } from '@/features/onboarding/mocks/home-investment-news-mock';
import {
  resolveHomeSearch,
  type HomeSearchResult,
} from '@/features/onboarding/services/resolve-home-search';
import {
  getInvestmentNews,
  type GetInvestmentNewsOptions,
} from '@/features/onboarding/services/get-investment-news';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

export type HomeSectionLoadState = 'loading' | 'ready' | 'error' | 'empty';

export type UseHomeScreenDataResult = {
  searchQuery: string;
  hasQuery: boolean;
  handleSearchChange: (query: string) => void;
  featuredFunds: FeaturedFund[];
  featuredState: HomeSectionLoadState;
  newsItems: InvestmentNewsItem[];
  newsState: HomeSectionLoadState;
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
    const fallback = [...HOME_INVESTMENT_NEWS_MOCK].slice(0, options?.limit ?? 4);

    if (fallback.length > 0) {
      return { items: fallback, state: 'ready' };
    }

    return { items: [], state: 'error' };
  }
}

async function loadDefaultRanking(): Promise<{
  result: HomeSearchResult | null;
  state: HomeSectionLoadState;
}> {
  try {
    const result = await resolveHomeSearch('');

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
    const { result, state } = await loadDefaultRanking();
    setDefaultRanking(result);
    setRankingState(state);
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
      const ranking = await loadDefaultRanking();
      if (!cancelled) {
        setDefaultRanking(ranking.result);
        setRankingState(ranking.state);
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
        const result = await resolveHomeSearch(debouncedQuery);

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

    await Promise.all([reloadFeatured(), reloadNews(), reloadRanking()]);

    if (searchQuery.trim()) {
      setSearchState('loading');
      try {
        const result = await resolveHomeSearch(searchQuery);
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
      const result = await resolveHomeSearch(searchQuery);
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
