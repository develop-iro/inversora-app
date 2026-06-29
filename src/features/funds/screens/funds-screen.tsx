import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FundCatalogSoraChip } from '@/features/assistant/components/fund-catalog-sora-chip';
import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { isQuestionLikeQuery } from '@/features/assistant/utils/search-intent';
import type { CatalogFund } from '@/core/domain/catalog';
import { FundApiErrorState } from '@/features/funds/components/fund-api-error-state';
import { FundCatalogCategorySections } from '@/features/funds/components/fund-catalog-category-sections';
import { FundCatalogEmptyState } from '@/features/funds/components/fund-catalog-empty-state';
import {
  DEFAULT_CATALOG_FILTERS,
  FundCatalogFiltersBar,
  toServiceFilters,
  type FundCatalogFiltersState,
} from '@/features/funds/components/fund-catalog-filters';
import { FundCatalogGrid } from '@/features/funds/components/fund-catalog-grid';
import { FundCatalogLoadMoreFooter } from '@/features/funds/components/fund-catalog-load-more-footer';
import { FundCatalogSearchField } from '@/features/funds/components/fund-catalog-search-field';
import { useCatalogFundsPagination } from '@/features/funds/hooks/use-catalog-funds-pagination';
import { deriveCatalogCategories } from '@/features/funds/utils/derive-catalog-categories';
import { CATALOG_SEARCH_DEBOUNCE_MS } from '@/features/funds/utils/fund-search';
import { groupFundsByCategory } from '@/features/funds/utils/group-funds-by-category';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
import { SegmentTabs } from '@/shared/components/ui';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { BottomTabInset, Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';

const SCROLL_LOAD_MORE_THRESHOLD_PX = 320;

function hasActiveSecondaryFilters(filters: FundCatalogFiltersState): boolean {
  return (
    filters.riskLevel !== 'all' ||
    filters.maxTerPercent != null ||
    filters.minScore != null ||
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
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [filters, setFilters] = useState<FundCatalogFiltersState>(DEFAULT_CATALOG_FILTERS);
  const [reloadToken, setReloadToken] = useState(0);
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);

  const debouncedQuery = useDebouncedValue(filters.query, CATALOG_SEARCH_DEBOUNCE_MS);
  const showSoraChip = isQuestionLikeQuery(debouncedQuery);

  const activeServiceFilters = useMemo(
    () => ({
      ...toServiceFilters(filters),
      query: debouncedQuery,
    }),
    [filters, debouncedQuery],
  );

  const { funds, meta, status, error, hasMore, loadMore, reload } =
    useCatalogFundsPagination(activeServiceFilters, reloadToken);

  const categoryTabs = useMemo(
    () => [
      { value: 'all' as const, label: 'Todas' },
      ...deriveCatalogCategories(funds).map((category) => ({
        value: category,
        label: category,
      })),
    ],
    [funds],
  );

  const groupedFunds = useMemo(() => groupFundsByCategory(funds), [funds]);
  const showGrouped = shouldGroupByCategory(filters, debouncedQuery);
  const hasActiveFilters = hasActiveNonSearchFilters(filters);
  const isInitialLoading = status === 'loading' || status === 'idle';
  const isLoadingMore = status === 'loading-more';
  const blockingError = error && funds.length === 0 ? error : null;
  const footerError = error && funds.length > 0 ? error : null;

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

  const handleCategoryChange = useCallback((categoryLabel: string | 'all') => {
    setFilters((current) => ({ ...current, categoryLabel }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setFilters((current) => ({ ...current, query: '' }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_CATALOG_FILTERS);
  }, []);

  const handleRetryLoad = useCallback(() => {
    setReloadToken((current) => current + 1);
    void reload();
  }, [reload]);

  const handleFundPress = useCallback(
    (fund: CatalogFund) => {
      router.push(routes.fundDetail(fund.isin));
    },
    [router],
  );

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + BottomTabInset + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={handleScroll}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <ThemedText type="sectionTitle">Catálogo de fondos</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            Explora fondos indexados con filtros básicos y rankings objetivos. Los
            resultados son educativos, no recomendaciones personalizadas.
          </ThemedText>
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

        <SegmentTabs
          accessibilityLabel="Filtrar catálogo por categoría"
          tabs={categoryTabs}
          value={filters.categoryLabel}
          onChange={handleCategoryChange}
        />

        <FundCatalogFiltersBar value={filters} onChange={handleFiltersChange} />

        {isInitialLoading ? (
          <ActivityIndicator style={styles.loader} color={theme.primary} />
        ) : blockingError ? (
          <FundApiErrorState
            title="No se pudo cargar el catálogo"
            message={blockingError}
            onRetry={handleRetryLoad}
          />
        ) : funds.length === 0 ? (
          <FundCatalogEmptyState
            query={debouncedQuery}
            hasActiveFilters={hasActiveFilters}
            onClearSearch={debouncedQuery.trim() ? handleClearSearch : undefined}
            onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
          />
        ) : (
          <View style={styles.results}>
            {!showGrouped ? (
              <ThemedText type="metaLabel" themeColor="textSecondary">
                {meta?.total != null
                  ? `${funds.length} de ${meta.total} fondo${meta.total === 1 ? '' : 's'}`
                  : `${funds.length} fondo${funds.length === 1 ? '' : 's'}`}
                {debouncedQuery.trim() ? ` para «${debouncedQuery.trim()}»` : ''}
              </ThemedText>
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

      <SoraChatSheet
        key={`catalog-sora-${soraSession}`}
        visible={isSoraVisible}
        onClose={() => {
          setIsSoraVisible(false);
        }}
        surface="catalog"
        initialMessage={debouncedQuery}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  results: {
    gap: Spacing.md,
  },
});
