import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CatalogFund } from '@/core/domain/catalog';
import {
  DEFAULT_CATALOG_FILTERS,
  FundCatalogFiltersBar,
  toServiceFilters,
  type FundCatalogFiltersState,
} from '@/features/funds/components/fund-catalog-filters';
import { FundListRow } from '@/features/funds/components/fund-list-row';
import { getFunds } from '@/features/funds/services/get-funds';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
import { SearchField } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { BottomTabInset, Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';

const SEARCH_SUGGESTIONS = [
  'Buscar por nombre o ISIN',
  'Renta variable global',
  'Fondos para empezar',
] as const;

export default function FundsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [filters, setFilters] = useState<FundCatalogFiltersState>(DEFAULT_CATALOG_FILTERS);
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          containerStyle={styles.search}
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
          <View style={styles.list}>
            <ThemedText type="metaLabel" themeColor="textSecondary">
              {funds.length} fondo{funds.length === 1 ? '' : 's'}
            </ThemedText>
            {funds.map((fund) => (
              <FundListRow
                key={fund.isin}
                fund={fund}
                onPress={() => router.push(routes.fundDetail(fund.isin))}
              />
            ))}
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
  search: {
    minHeight: 56,
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  empty: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
  },
  list: {
    gap: Spacing.md,
  },
});
