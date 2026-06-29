import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { MAX_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { CompareFundPickerRow } from '@/features/comparison/components/compare-fund-picker-row';
import { loadComparePickerFunds } from '@/features/comparison/services/load-compare-picker-funds';
import { CATALOG_SEARCH_DEBOUNCE_MS } from '@/features/funds/utils/fund-search';
import {
  ScreenBody,
  ScreenBodyIntro,
  ScreenFooter,
  ScreenHeader,
  ScreenHeaderIconButton,
  ScreenShell,
} from '@/shared/components/layout';
import { ThemedText } from '@/shared/components/themed-text';
import { Button, ContentEmptyState, SearchField, SkeletonShimmerProvider } from '@/shared/components/ui';
import { SkeletonPickerRow } from '@/shared/components/ui/skeleton-picker-row';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

export type CompareFundPickerModalProps = {
  visible: boolean;
  selectedIsins: readonly string[];
  canAddMore: boolean;
  onClose: () => void;
  onSelectFund: (fund: CatalogFund) => void;
};

function PickerLoadingSkeleton() {
  return (
    <SkeletonShimmerProvider>
      <View style={styles.skeletonList} accessibilityLabel="Cargando catálogo">
        <SkeletonPickerRow />
        <SkeletonPickerRow />
        <SkeletonPickerRow />
        <SkeletonPickerRow />
      </View>
    </SkeletonShimmerProvider>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

/**
 * Full-screen sheet to search and add funds to the comparison selection.
 */
export function CompareFundPickerModal({
  visible,
  selectedIsins,
  canAddMore,
  onClose,
  onSelectFund,
}: CompareFundPickerModalProps) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const debouncedQuery = useDebouncedValue(query, CATALOG_SEARCH_DEBOUNCE_MS);

  const resetModalState = useCallback(() => {
    setQuery('');
    setFunds([]);
    setErrorMessage(null);
    setIsLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    resetModalState();
    onClose();
  }, [onClose, resetModalState]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      if (!cancelled) {
        setIsLoading(true);
        setErrorMessage(null);
      }

      try {
        const loaded = await loadComparePickerFunds(debouncedQuery, {
          signal: controller.signal,
        });

        if (!cancelled) {
          setFunds(loaded);
        }
      } catch {
        if (!cancelled) {
          setFunds([]);
          setErrorMessage('No se pudo cargar el catálogo para comparar fondos.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [visible, debouncedQuery, reloadToken]);

  const filteredFunds = useMemo(
    () => funds.filter((fund) => !selectedIsins.includes(fund.isin)),
    [funds, selectedIsins],
  );

  const listHeader = useMemo(() => {
    const trimmedQuery = debouncedQuery.trim();

    return (
      <View style={styles.listHeader}>
        <ThemedText type="metaLabel" themeColor="textSecondary" style={styles.sectionEyebrow}>
          {trimmedQuery.length > 0
            ? `${filteredFunds.length} resultado${filteredFunds.length === 1 ? '' : 's'}`
            : 'Fondos del catálogo educativo'}
        </ThemedText>
        {!canAddMore ? (
          <View style={[styles.limitChip, { backgroundColor: theme.backgroundSoft }]}>
            <ThemedText type="caption" themeColor="textSecondary">
              Máximo de {MAX_COMPARE_FUNDS} fondos en comparación
            </ThemedText>
          </View>
        ) : null}
      </View>
    );
  }, [canAddMore, debouncedQuery, filteredFunds.length, theme.backgroundSoft]);

  const handleRetry = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  const handleSelectFund = useCallback(
    (fund: CatalogFund) => {
      onSelectFund(fund);
      handleClose();
    },
    [handleClose, onSelectFund],
  );

  const renderListContent = () => {
    if (isLoading) {
      return <PickerLoadingSkeleton />;
    }

    if (errorMessage !== null) {
      return (
        <ContentEmptyState
          icon="cloud-off-outline"
          title="No se pudo cargar el catálogo"
          message={errorMessage}
          actionLabel="Reintentar"
          onAction={handleRetry}
        />
      );
    }

    if (filteredFunds.length === 0) {
      const trimmedQuery = debouncedQuery.trim();

      return (
        <ContentEmptyState
          icon={trimmedQuery.length > 0 ? 'magnify-close' : 'database-off-outline'}
          title={trimmedQuery.length > 0 ? 'Sin coincidencias' : 'Catálogo vacío'}
          message={
            trimmedQuery.length > 0
              ? `No encontramos fondos para “${trimmedQuery}”. Prueba con el nombre completo o el ISIN.`
              : 'No hay fondos visibles disponibles en este momento.'
          }
          actionLabel={trimmedQuery.length > 0 ? 'Limpiar búsqueda' : 'Reintentar'}
          onAction={trimmedQuery.length > 0 ? () => setQuery('') : handleRetry}
        />
      );
    }

    return (
      <FlatList
        data={filteredFunds}
        keyExtractor={(fund) => fund.isin}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <CompareFundPickerRow
            fund={item}
            disabled={!canAddMore}
            onPress={() => handleSelectFund(item)}
          />
        )}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ScreenShell
        header={
          <ScreenHeader
            title="Elegir fondo"
            trailing={
              <ScreenHeaderIconButton
                icon="close"
                accessibilityLabel="Cerrar selector de fondos"
                onPress={handleClose}
              />
            }
          />
        }
        body={
          <ScreenBody>
            <ScreenBodyIntro description="Busca por nombre, ISIN o categoría y añádelo a la comparación.">
              {selectedIsins.length > 0 ? (
                <View style={[styles.selectionChip, { backgroundColor: theme.backgroundSoft }]}>
                  <MaterialCommunityIcons name="scale-balance" size={16} color={theme.primary} />
                  <ThemedText type="caption" themeColor="textSecondary">
                    {selectedIsins.length} fondo{selectedIsins.length === 1 ? '' : 's'} en comparación
                  </ThemedText>
                </View>
              ) : null}
            </ScreenBodyIntro>

            <SearchField
              variant="plain"
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar por nombre, ISIN o categoría"
              accessibilityLabel="Buscar fondo para comparar"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />

            <View style={styles.listArea}>{renderListContent()}</View>
          </ScreenBody>
        }
        footer={
          <ScreenFooter>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.footerSummary}>
              {selectedIsins.length > 0
                ? `${selectedIsins.length} de ${MAX_COMPARE_FUNDS} fondos seleccionados`
                : 'Selecciona al menos dos fondos para comparar'}
            </ThemedText>
            <Button label="Listo" onPress={handleClose} />
          </ScreenFooter>
        }
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  selectionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  listArea: {
    flex: 1,
    minHeight: 0,
    paddingTop: Spacing.md,
  },
  listHeader: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionEyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  limitChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  listContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  separator: {
    height: Spacing.sm,
  },
  skeletonList: {
    gap: Spacing.sm,
  },
  footerSummary: {
    textAlign: 'center',
  },
});
