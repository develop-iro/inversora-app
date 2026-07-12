import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';

import { FundCatalogSoraChip } from '@/features/assistant/components/fund-catalog-sora-chip';
import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { isQuestionLikeQuery } from '@/features/assistant/utils/search-intent';
import { trackEvent, trackPerfMark } from '@/core/analytics/track-event';
import type { CatalogFund } from '@/core/domain/catalog';
import { FundCatalogProfileHintsBanner } from '@/features/learn/components/fund-catalog-profile-hints-banner';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import {
  areProfileHintsApplied,
  mapProfileToCatalogHints,
} from '@/features/learn/services/map-profile-to-catalog-hints';
import { FundApiErrorState } from '@/features/funds/components/fund-api-error-state';
import { FundCatalogActiveFilterChips } from '@/features/funds/components/fund-catalog-active-filter-chips';
import { FundCatalogCategorySections } from '@/features/funds/components/fund-catalog-category-sections';
import { FundCatalogEmptyState } from '@/features/funds/components/fund-catalog-empty-state';
import {
  DEFAULT_CATALOG_FILTERS,
  toServiceFilters,
  type FundCatalogFiltersState,
} from '@/features/funds/components/fund-catalog-filters';
import { FundCatalogFiltersSheet } from '@/features/funds/components/fund-catalog-filters-sheet';
import { FundCatalogGrid } from '@/features/funds/components/fund-catalog-grid';
import { FundCatalogLoadMoreFooter } from '@/features/funds/components/fund-catalog-load-more-footer';
import { FundCatalogSearchField } from '@/features/funds/components/fund-catalog-search-field';
import { FundCatalogToolbar } from '@/features/funds/components/fund-catalog-toolbar';
import { useCatalogFundsIndex } from '@/features/funds/hooks/use-catalog-category-index';
import { useCatalogFundsPagination } from '@/features/funds/hooks/use-catalog-funds-pagination';
import { invalidateCatalogCache } from '@/features/funds/services/get-funds';
import { buildCatalogCategoryOptions } from '@/features/funds/utils/build-catalog-category-options';
import {
  buildCatalogActiveFilterChips,
  countActiveCatalogFilters,
  formatCatalogResultsHeadline,
} from '@/features/funds/utils/catalog-filter-presentation';
import { countCatalogFunds } from '@/features/funds/utils/filter-catalog-funds';
import { CATALOG_SEARCH_DEBOUNCE_MS } from '@/features/funds/utils/fund-search';
import { groupFundsByCategory } from '@/features/funds/utils/group-funds-by-category';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { TabScreenScroll } from '@/shared/components/layout';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Spinner } from '@/shared/components/ui';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { routes } from '@/shared/navigation/routes';
import { Spacing } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

const SCROLL_LOAD_MORE_THRESHOLD_PX = 320;

function hasActiveSecondaryFilters(filters: FundCatalogFiltersState): boolean {
  return (
    filters.riskLevel !== 'all' ||
    filters.maxTerPercent != null ||
    filters.minScore != null ||
    filters.minReturnPercent != null ||
    filters.idealForBeginnersOnly
  );
}

function hasActiveNonSearchFilters(filters: FundCatalogFiltersState): boolean {
  return filters.categoryLabel !== 'all' || hasActiveSecondaryFilters(filters);
}

function shouldGroupByCategory(
  filters: FundCatalogFiltersState,
  debouncedQuery: string,
): boolean {
  return (
    filters.categoryLabel === 'all' &&
    !debouncedQuery.trim() &&
    !hasActiveSecondaryFilters(filters)
  );
}

function isNearScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>): boolean {
  const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - SCROLL_LOAD_MORE_THRESHOLD_PX
  );
}

export default function FundsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ applyProfileHints?: string | string[] }>();
  const { profile: educationalProfile } = useEducationalProfile();
  const [filters, setFilters] = useState<FundCatalogFiltersState>(DEFAULT_CATALOG_FILTERS);
  const [reloadToken, setReloadToken] = useState(0);
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filtersSheetSession, setFiltersSheetSession] = useState(0);
  const [isProfileHintsDismissed, setIsProfileHintsDismissed] = useState(false);
  const catalogLoadStartedAtRef = useRef(0);

  useEffect(() => {
    catalogLoadStartedAtRef.current = performance.now();
  }, []);

  const profileHints = useMemo(
    () => (educationalProfile ? mapProfileToCatalogHints(educationalProfile) : null),
    [educationalProfile],
  );

  const shouldAutoApplyProfileHints = useMemo(() => {
    const raw = params.applyProfileHints;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value === 'true';
  }, [params.applyProfileHints]);

  useEffect(() => {
    if (!shouldAutoApplyProfileHints || !profileHints) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setFilters((current) => ({
        ...current,
        ...profileHints.filters,
        query: current.query,
      }));
      setIsProfileHintsDismissed(true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [profileHints, shouldAutoApplyProfileHints]);

  const debouncedQuery = useDebouncedValue(filters.query, CATALOG_SEARCH_DEBOUNCE_MS);
  const showSoraChip = isQuestionLikeQuery(debouncedQuery);

  const activeServiceFilters = useMemo(
    () => ({
      ...toServiceFilters(filters),
      query: debouncedQuery,
    }),
    [filters, debouncedQuery],
  );

  const { funds, meta, status, error, hasMore, loadMore } =
    useCatalogFundsPagination(activeServiceFilters, reloadToken);

  const { funds: catalogFundsIndex } = useCatalogFundsIndex();

  const categoryOptions = useMemo(
    () => buildCatalogCategoryOptions(catalogFundsIndex),
    [catalogFundsIndex],
  );

  const categoryLabelById = useMemo(
    () => new Map(categoryOptions.map((category) => [category.id, category.label])),
    [categoryOptions],
  );

  const activeFilterCount = countActiveCatalogFilters(filters);
  const activeFilterChips = useMemo(
    () => buildCatalogActiveFilterChips(filters, categoryLabelById),
    [filters, categoryLabelById],
  );

  const selectedCategoryLabel =
    filters.categoryLabel === 'all'
      ? undefined
      : categoryLabelById.get(filters.categoryLabel) ?? filters.categoryLabel;
  const appliedPreviewResultCount = useMemo(() => {
    if (catalogFundsIndex.length === 0) {
      return null;
    }

    return countCatalogFunds(catalogFundsIndex, activeServiceFilters);
  }, [activeServiceFilters, catalogFundsIndex]);
  const resolvedResultCount = appliedPreviewResultCount ?? meta?.total ?? null;
  const loadedTotalCount = resolvedResultCount ?? meta?.total ?? null;

  const resultsHeadline = formatCatalogResultsHeadline(resolvedResultCount, funds.length, {
    categoryLabel: selectedCategoryLabel,
    query: debouncedQuery,
  });

  const totalCatalogFundCount = useMemo(() => {
    return categoryOptions.reduce((sum, category) => sum + category.fundCount, 0);
  }, [categoryOptions]);

  const groupedFunds = useMemo(() => groupFundsByCategory(funds), [funds]);
  const showGrouped = shouldGroupByCategory(filters, debouncedQuery);
  const hasActiveFilters = hasActiveNonSearchFilters(filters);
  const isInitialLoading = (status === 'loading' || status === 'idle') && funds.length === 0;
  const isRefreshing = status === 'refreshing';
  const isLoadingMore = status === 'loading-more';
  const blockingError = error && funds.length === 0 ? error : null;
  const footerError = error && funds.length > 0 ? error : null;

  useEffect(() => {
    if (!isInitialLoading && status === 'ready') {
      trackPerfMark('funds_catalog', performance.now() - catalogLoadStartedAtRef.current);
    }
  }, [isInitialLoading, status]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!hasMore || isInitialLoading || isLoadingMore) {
        return;
      }

      if (isNearScrollEnd(event)) {
        void loadMore();
      }
    },
    [hasMore, isInitialLoading, isLoadingMore, loadMore],
  );

  const handleQueryChange = useCallback((query: string) => {
    setFilters((current) => ({ ...current, query }));
  }, []);

  const handleFiltersChange = useCallback((next: FundCatalogFiltersState) => {
    setFilters(next);
  }, []);

  const handleRemoveFilterChip = useCallback((chipId: string) => {
    setFilters((current) => {
      switch (chipId) {
        case 'category':
          return { ...current, categoryLabel: 'all' };
        case 'risk':
          return { ...current, riskLevel: 'all' };
        case 'ter':
          return { ...current, maxTerPercent: null };
        case 'score':
          return { ...current, minScore: null };
        case 'beginners':
          return { ...current, idealForBeginnersOnly: false };
        case 'return':
          return { ...current, minReturnPercent: null };
        default:
          return current;
      }
    });
  }, []);

  const handleResetSecondaryFilters = useCallback(() => {
    setFilters((current) => ({
      ...DEFAULT_CATALOG_FILTERS,
      query: current.query,
    }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setFilters((current) => ({ ...current, query: '' }));
  }, []);

  const handleRetryLoad = useCallback(() => {
    invalidateCatalogCache();
    setReloadToken((current) => current + 1);
  }, []);

  const handleFundPress = useCallback(
    (fund: CatalogFund) => {
      void trackEvent('fund_opened', 'funds_catalog', { isin: fund.isin });
      router.push(routes.fundDetail(fund.isin));
    },
    [router],
  );

  const handleApplyProfileHints = useCallback(() => {
    if (!profileHints) {
      return;
    }

    setFilters((current) => ({
      ...current,
      ...profileHints.filters,
      query: current.query,
    }));
    setIsProfileHintsDismissed(true);
  }, [profileHints]);

  const profileHintsApplied =
    profileHints !== null && areProfileHintsApplied(filters, profileHints.filters);

  return (
    <TabScreenScroll
      extraBottomPadding={Spacing.xl}
      contentContainerClassName="items-center pt-lg"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={handleScroll}
    >
      <View className="w-full max-w-[760px] gap-lg px-lg">
        <View className="gap-sm">
          <TextHeading variant="section">Catálogo de fondos</TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Explora fondos indexados con filtros claros. Resultados educativos, no
            recomendaciones personalizadas.
          </TextParagraph>
        </View>

        <FundCatalogSearchField query={filters.query} onQueryChange={handleQueryChange} />

        {showSoraChip ? (
          <FundCatalogSoraChip
            query={debouncedQuery}
            onPress={() => {
              setSoraSession((current) => current + 1);
              setIsSoraVisible(true);
            }}
          />
        ) : null}

        {profileHints && !isProfileHintsDismissed ? (
          <FundCatalogProfileHintsBanner
            hints={profileHints}
            isApplied={profileHintsApplied}
            onApply={handleApplyProfileHints}
            onDismiss={() => setIsProfileHintsDismissed(true)}
          />
        ) : null}

        <FundCatalogToolbar
          headline={resultsHeadline}
          activeFilterCount={activeFilterCount}
          sort={{ sortBy: filters.sortBy, sortOrder: filters.sortOrder }}
          onSortChange={(option) => {
            setFilters((current) => ({
              ...current,
              sortBy: option.sortBy,
              sortOrder: option.sortOrder,
            }));
          }}
          onOpenFilters={() => {
            setFiltersSheetSession((current) => current + 1);
            setIsFiltersVisible(true);
          }}
        />

        <FundCatalogActiveFilterChips
          chips={activeFilterChips}
          onRemoveChip={handleRemoveFilterChip}
          onClearAll={handleResetSecondaryFilters}
        />

        {isInitialLoading ? (
          <Spinner size="lg" accessibilityLabel="Cargando catálogo" style={{ marginVertical: Spacing.xl }} />
        ) : blockingError ? (
          <FundApiErrorState
            title="No se pudo cargar el catálogo"
            message={blockingError}
            onRetry={handleRetryLoad}
            layout="section"
            className="w-full"
          />
        ) : funds.length === 0 ? (
          <FundCatalogEmptyState
            query={debouncedQuery}
            hasActiveFilters={hasActiveFilters}
            onClearSearch={debouncedQuery.trim() ? handleClearSearch : undefined}
            onResetFilters={hasActiveFilters ? handleResetSecondaryFilters : undefined}
          />
        ) : (
          <View className={cn('gap-md', isRefreshing && 'opacity-[0.72]')}>
            {isRefreshing ? (
              <View className="flex-row items-center gap-sm">
                <Spinner.BarChart size="sm" />
                <TextLabel variant="meta" themeColor="textSecondary">
                  Actualizando resultados…
                </TextLabel>
              </View>
            ) : null}

            {!showGrouped ? (
              <TextLabel variant="meta" themeColor="textSecondary">
                {loadedTotalCount != null
                  ? `${funds.length} de ${loadedTotalCount} cargado${loadedTotalCount === 1 ? '' : 's'}`
                  : `${funds.length} cargado${funds.length === 1 ? '' : 's'}`}
              </TextLabel>
            ) : null}

            {showGrouped ? (
              <FundCatalogCategorySections
                groups={groupedFunds}
                onFundPress={handleFundPress}
              />
            ) : (
              <FundCatalogGrid funds={funds} onFundPress={handleFundPress} />
            )}

            <FundCatalogLoadMoreFooter
              loadedCount={funds.length}
              totalCount={meta?.total ?? null}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              errorMessage={footerError}
              onLoadMore={() => {
                void loadMore();
              }}
            />
          </View>
        )}

        <LegalNotice
          body="Guardar o comparar fondos no implica una recomendación de inversión. Revisa siempre comisiones, riesgo y horizonte temporal."
        />
      </View>

      <FundCatalogFiltersSheet
        visible={isFiltersVisible}
        sessionKey={filtersSheetSession}
        value={filters}
        categories={categoryOptions}
        catalogFundsIndex={catalogFundsIndex}
        totalFundCount={totalCatalogFundCount}
        resultCount={resolvedResultCount}
        onClose={() => setIsFiltersVisible(false)}
        onApply={handleFiltersChange}
      />

      <SoraChatSheet
        key={`catalog-sora-${soraSession}`}
        visible={isSoraVisible}
        onClose={() => {
          setIsSoraVisible(false);
        }}
        surface="catalog"
        initialMessage={debouncedQuery}
      />
    </TabScreenScroll>
  );
}
