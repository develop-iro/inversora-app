import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { MAX_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { CompareFundPickerRow } from '@/features/comparison/components/compare-fund-picker-row';
import { loadComparePickerFunds } from '@/features/comparison/services/load-compare-picker-funds';
import { CATALOG_SEARCH_DEBOUNCE_MS } from '@/features/funds/utils/fund-search';
import {
  ScreenBody,
  ScreenBodyIntro,
  ScreenFooter,
} from '@/shared/components/layout';
import { AppModalShell } from '@/shared/components/overlay';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { FundListRow } from '@/features/funds/components/fund-list-row';
import { Button, ContentEmptyState, ReloadState, SearchField, SkeletonShimmerProvider } from '@/shared/components/ui';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { useTheme } from '@/shared/hooks/use-theme';

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
      <View className="gap-sm" accessibilityLabel="Cargando catálogo">
        {Array.from({ length: 4 }, (_, index) => (
          <FundListRow key={`picker-loading-${index}`} loading />
        ))}
      </View>
    </SkeletonShimmerProvider>
  );
}

function ListSeparator() {
  return <View className="h-sm" />;
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
      <View className="mb-sm gap-sm">
        <TextLabel variant="meta" themeColor="textSecondary" className="uppercase tracking-[0.6px]">
          {trimmedQuery.length > 0
            ? `${filteredFunds.length} resultado${filteredFunds.length === 1 ? '' : 's'}`
            : 'Fondos del catálogo educativo'}
        </TextLabel>
        {!canAddMore ? (
          <View className="self-start rounded-full bg-background-soft px-md py-xs">
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Máximo de {MAX_COMPARE_FUNDS} fondos en comparación
            </TextParagraph>
          </View>
        ) : null}
      </View>
    );
  }, [canAddMore, debouncedQuery, filteredFunds.length]);

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
        <ReloadState
          title="No se pudo cargar el catálogo"
          message={errorMessage}
          onAction={handleRetry}
          layout="screen"
          className="flex-1"
        />
      );
    }

    if (filteredFunds.length === 0) {
      const trimmedQuery = debouncedQuery.trim();

      return (
        <ContentEmptyState
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
        contentContainerClassName="gap-sm pb-xl"
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
    <AppModalShell
      visible={visible}
      onClose={handleClose}
      title="Elegir fondo"
      body={
        <ScreenBody>
          <ScreenBodyIntro description="Busca por nombre, ISIN o categoría y añádelo a la comparación.">
            {selectedIsins.length > 0 ? (
              <View className="flex-row items-center gap-sm self-start rounded-full bg-background-soft px-md py-xs">
                <MaterialCommunityIcons name="scale-balance" size={16} color={theme.primary} />
                <TextParagraph variant="secondary" themeColor="textSecondary">
                  {selectedIsins.length} fondo{selectedIsins.length === 1 ? '' : 's'} en comparación
                </TextParagraph>
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

          <View className="min-h-0 flex-1 pt-md">{renderListContent()}</View>
        </ScreenBody>
      }
      footer={
        <ScreenFooter>
          <TextParagraph variant="secondary" themeColor="textSecondary" className="text-center">
            {selectedIsins.length > 0
              ? `${selectedIsins.length} de ${MAX_COMPARE_FUNDS} fondos seleccionados`
              : 'Selecciona al menos dos fondos para comparar'}
          </TextParagraph>
          <Button label="Listo" onPress={handleClose} />
        </ScreenFooter>
      }
    />
  );
}
