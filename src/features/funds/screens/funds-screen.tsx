import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CatalogFund } from '@/core/domain/catalog';
import { FundCatalogCategorySections } from '@/features/funds/components/fund-catalog-category-sections';
import {
  DEFAULT_CATALOG_FILTERS,
  FundCatalogFiltersBar,
  toServiceFilters,
  type FundCatalogFiltersState,
} from '@/features/funds/components/fund-catalog-filters';
import { FundCatalogGrid } from '@/features/funds/components/fund-catalog-grid';
import { CATALOG_CATEGORIES } from '@/features/funds/mocks/catalog-funds-mock';
import { getFunds } from '@/features/funds/services/get-funds';
import { groupFundsByCategory } from '@/features/funds/utils/group-funds-by-category';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
import { SearchField, SegmentTabs } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { BottomTabInset, Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';

const SEARCH_SUGGESTIONS = [
  'Buscar por nombre o ISIN',
  'Renta variable global',
  'Fondos para empezar',
] as const;

function hasActiveSecondaryFilters(filters: FundCatalogFiltersState): boolean {
  return (
    filters.riskLevel !== 'all' ||
    filters.maxTerPercent != null ||
    filters.minScore != null ||
    filters.idealForBeginnersOnly
  );
}

function shouldGroupByCategory(filters: FundCatalogFiltersState): boolean {
  return (
    filters.categoryLabel === 'all' &&
    !filters.query.trim() &&
    !hasActiveSecondaryFilters(filters)
  );
}

export default function FundsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [filters, setFilters] = useState<FundCatalogFiltersState>(DEFAULT_CATALOG_FILTERS);
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryTabs = useMemo(
    () => [
      { value: 'all' as const, label: 'Todas' },
      ...CATALOG_CATEGORIES.map((category) => ({
        value: category,
        label: category,
      })),
    ],
    [],
  );

  const groupedFunds = useMemo(() => groupFundsByCategory(funds), [funds]);
  const showGrouped = shouldGroupByCategory(filters);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const results = await getFunds(toServiceFilters(filters));
      if (!cancelled) {
        setFunds(results);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const handleQueryChange = useCallback((query: string) => {
    setIsLoading(true);
    setFilters((current) => ({ ...current, query }));
  }, []);

  const handleFiltersChange = useCallback((next: FundCatalogFiltersState) => {
    setIsLoading(true);
    setFilters(next);
  }, []);

  const handleCategoryChange = useCallback((categoryLabel: string | 'all') => {
    setIsLoading(true);
    setFilters((current) => ({ ...current, categoryLabel }));
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

        <SearchField
          accessibilityLabel="Buscar fondos por nombre, ISIN o categoría"
          placeholder="Buscar por nombre o ISIN"
          value={filters.query}
          onChangeText={handleQueryChange}
          suggestions={[...SEARCH_SUGGESTIONS]}
        />

        <SegmentTabs
          accessibilityLabel="Filtrar catálogo por categoría"
          tabs={categoryTabs}
          value={filters.categoryLabel}
          onChange={handleCategoryChange}
        />

        <FundCatalogFiltersBar value={filters} onChange={handleFiltersChange} />

        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={theme.primary} />
        ) : funds.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText type="bodyBold">Sin resultados</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Prueba a ampliar los filtros o cambia el texto de búsqueda.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.results}>
            {!showGrouped ? (
              <ThemedText type="metaLabel" themeColor="textSecondary">
                {funds.length} fondo{funds.length === 1 ? '' : 's'}
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
  empty: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
  },
  results: {
    gap: Spacing.md,
  },
});
