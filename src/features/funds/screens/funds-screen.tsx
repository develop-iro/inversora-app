import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
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
import { FundCatalogSearchField } from '@/features/funds/components/fund-catalog-search-field';
import {
  getCatalogBrowseIndex,
  getFunds,
  resetCatalogBrowseIndex,
} from '@/features/funds/services/get-funds';
import { deriveCatalogCategories } from '@/features/funds/utils/derive-catalog-categories';
import { resolveFundApiErrorMessage } from '@/features/funds/utils/resolve-fund-api-error-message';
import { CATALOG_SEARCH_DEBOUNCE_MS } from '@/features/funds/utils/fund-search';
import { groupFundsByCategory } from '@/features/funds/utils/group-funds-by-category';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
import { SegmentTabs } from '@/shared/components/ui';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { BottomTabInset, Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';

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

export default function FundsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [filters, setFilters] = useState<FundCatalogFiltersState>(DEFAULT_CATALOG_FILTERS);
  const [browseIndex, setBrowseIndex] = useState<CatalogFund[]>([]);
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [isBrowseLoading, setIsBrowseLoading] = useState(true);
  const [isResultsLoading, setIsResultsLoading] = useState(true);
  const [browseError, setBrowseError] = useState<string | null>(null);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);

  const debouncedQuery = useDebouncedValue(filters.query, CATALOG_SEARCH_DEBOUNCE_MS);
  const showSoraChip = isQuestionLikeQuery(debouncedQuery);

  const categoryTabs = useMemo(
    () => [
      { value: 'all' as const, label: 'Todas' },
      ...deriveCatalogCategories(browseIndex).map((category) => ({
        value: category,
        label: category,
      })),
    ],
    [browseIndex],
  );

  const activeServiceFilters = useMemo(
    () => ({
      ...toServiceFilters(filters),
      query: debouncedQuery,
    }),
    [filters, debouncedQuery],
  );

  const groupedFunds = useMemo(() => groupFundsByCategory(funds), [funds]);
  const showGrouped = shouldGroupByCategory(filters, debouncedQuery);
  const hasActiveFilters = hasActiveNonSearchFilters(filters);
  const isInitialLoading = isBrowseLoading || (isResultsLoading && funds.length === 0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsBrowseLoading(true);
      setBrowseError(null);

      try {
        const loaded = await getCatalogBrowseIndex();

        if (!cancelled) {
          setBrowseIndex(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          setBrowseIndex([]);
          setBrowseError(resolveFundApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsBrowseLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsResultsLoading(true);
      setResultsError(null);

      try {
        const loaded = await getFunds(activeServiceFilters);

        if (!cancelled) {
          setFunds(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          setFunds([]);
          setResultsError(resolveFundApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsResultsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeServiceFilters, reloadToken]);

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
    resetCatalogBrowseIndex();
    setReloadToken((current) => current + 1);
  }, []);

  const handleFundPress = useCallback(
    (fund: CatalogFund) => {
      router.push(routes.fundDetail(fund.isin));
    },
    [router],
  );

  const blockingError = browseError ?? (resultsError && funds.length === 0 ? resultsError : null);

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
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <ThemedText type="sectionTitle">Catálogo de fondos</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            Explora fondos indexados con filtros básicos y rankings objetivos. Los
            resultados son educativos, no recomendaciones personalizadas.
          </ThemedText>
        </View>

        <FundCatalogSearchField
          query={filters.query}
          catalog={browseIndex}
          onQueryChange={handleQueryChange}
        />

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
            {isResultsLoading ? (
              <ActivityIndicator style={styles.inlineLoader} color={theme.primary} />
            ) : null}

            {resultsError ? (
              <ThemedText type="caption" themeColor="textSecondary">
                {resultsError}
              </ThemedText>
            ) : null}

            {!showGrouped ? (
              <ThemedText type="metaLabel" themeColor="textSecondary">
                {funds.length} fondo{funds.length === 1 ? '' : 's'}
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
  inlineLoader: {
    alignSelf: 'flex-start',
  },
  results: {
    gap: Spacing.md,
  },
});
