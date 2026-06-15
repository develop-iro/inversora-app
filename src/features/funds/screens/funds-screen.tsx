import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CatalogFund } from '@/core/domain/catalog';
import { FundCatalogCategorySections } from '@/features/funds/components/fund-catalog-category-sections';
import { FundApiErrorState } from '@/features/funds/components/fund-api-error-state';
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
  filterCatalogFunds,
  getCatalogFunds,
  resetCatalogCache,
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
  const [catalog, setCatalog] = useState<CatalogFund[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const debouncedQuery = useDebouncedValue(filters.query, CATALOG_SEARCH_DEBOUNCE_MS);

  const categoryTabs = useMemo(
    () => [
      { value: 'all' as const, label: 'Todas' },
      ...deriveCatalogCategories(catalog).map((category) => ({
        value: category,
        label: category,
      })),
    ],
    [catalog],
  );

  const activeServiceFilters = useMemo(
    () => ({
      ...toServiceFilters(filters),
      query: debouncedQuery,
    }),
    [filters, debouncedQuery],
  );

  const funds = useMemo(
    () => filterCatalogFunds(catalog, activeServiceFilters),
    [catalog, activeServiceFilters],
  );

  const groupedFunds = useMemo(() => groupFundsByCategory(funds), [funds]);
  const showGrouped = shouldGroupByCategory(filters, debouncedQuery);
  const hasActiveFilters = hasActiveNonSearchFilters(filters);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsInitialLoading(true);
      setLoadError(null);

      try {
        const loaded = await getCatalogFunds();

        if (!cancelled) {
          setCatalog(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          setCatalog([]);
          setLoadError(resolveFundApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsInitialLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const handleRetryLoad = useCallback(() => {
    resetCatalogCache();
    setReloadToken((current) => current + 1);
  }, []);

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
          catalog={catalog}
          onQueryChange={handleQueryChange}
        />

        <SegmentTabs
          accessibilityLabel="Filtrar catálogo por categoría"
          tabs={categoryTabs}
          value={filters.categoryLabel}
          onChange={handleCategoryChange}
        />

        <FundCatalogFiltersBar value={filters} onChange={handleFiltersChange} />

        {isInitialLoading ? (
          <ActivityIndicator style={styles.loader} color={theme.primary} />
        ) : loadError ? (
          <FundApiErrorState
            title="No se pudo cargar el catálogo"
            message={loadError}
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
