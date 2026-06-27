import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CatalogFund } from '@/core/domain/catalog';
import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { CompareFundPickerModal } from '@/features/comparison/components/compare-fund-picker-modal';
import { CompareMetricsTable } from '@/features/comparison/components/compare-metrics-table';
import { useCompareSelection } from '@/features/comparison/hooks/use-compare-selection';
import { getFunds } from '@/features/funds/services/get-funds';
import { MIN_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { BottomTabInset, Layout, Radius, Spacing } from '@/shared/theme/theme';

function parseIsinsParam(value: string | string[] | undefined): string[] {
  if (value === undefined) {
    return [];
  }

  const raw = Array.isArray(value) ? value.join(',') : value;

  return raw
    .split(',')
    .map((isin) => isin.trim().toUpperCase())
    .filter((isin) => isin.length > 0);
}

export default function ComparisonScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ isins?: string | string[] }>();
  const {
    selectedIsins,
    isLoading: isSelectionLoading,
    canAddMore,
    addFund,
    removeFund,
    setFunds,
  } = useCompareSelection();
  const [catalogFunds, setCatalogFunds] = useState<CatalogFund[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);
  const hasSeededRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    getFunds()
      .then((funds) => {
        if (!cancelled) {
          setCatalogFunds(funds);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsCatalogLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hasSeededRef.current || isSelectionLoading) {
      return;
    }

    const seededIsins = parseIsinsParam(params.isins);

    hasSeededRef.current = true;

    if (seededIsins.length === 0) {
      return;
    }

    void setFunds(seededIsins);
  }, [isSelectionLoading, params.isins, setFunds]);

  const selectedFunds = useMemo(
    () =>
      selectedIsins
        .map((isin) => catalogFunds.find((fund) => fund.isin === isin))
        .filter((fund): fund is CatalogFund => fund !== undefined),
    [catalogFunds, selectedIsins],
  );

  const canAskSora = selectedFunds.length >= MIN_COMPARE_FUNDS;
  const isLoading = isSelectionLoading || isCatalogLoading;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Spacing.xl,
          paddingBottom: insets.bottom + BottomTabInset,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <ThemedText type="sectionTitle">Comparar</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          Compara métricas clave de varios fondos en una sola vista educativa. No implica
          recomendación de inversión.
        </ThemedText>
      </View>

      {isLoading ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        <>
          <View style={styles.selectionBlock}>
            <ThemedText type="bodyBold">Fondos seleccionados</ThemedText>
            <View style={styles.chips}>
              {selectedIsins.length === 0 ? (
                <ThemedText type="caption" themeColor="textSecondary">
                  Añade al menos dos fondos para iniciar la comparación.
                </ThemedText>
              ) : (
                selectedIsins.map((isin) => {
                  const fund = catalogFunds.find((item) => item.isin === isin);

                  return (
                    <Pressable
                      key={isin}
                      accessibilityRole="button"
                      accessibilityLabel={`Quitar ${fund?.name ?? isin} de la comparación`}
                      onPress={() => {
                        void removeFund(isin);
                      }}
                      style={({ pressed }) => [
                        styles.chip,
                        { borderColor: theme.border, backgroundColor: theme.surface },
                        pressed && styles.chipPressed,
                      ]}
                    >
                      <ThemedText type="caption" numberOfLines={1}>
                        {fund?.name ?? isin}
                      </ThemedText>
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={16}
                        color={theme.textSecondary}
                      />
                    </Pressable>
                  );
                })
              )}
            </View>

            <Button
              label={canAddMore ? 'Añadir fondo' : 'Máximo alcanzado'}
              variant="secondary"
              onPress={() => setIsPickerVisible(true)}
              disabled={!canAddMore}
            />
          </View>

          {selectedFunds.length >= MIN_COMPARE_FUNDS ? (
            <CompareMetricsTable funds={selectedFunds} />
          ) : null}

          <View style={styles.soraBlock}>
            <ThemedText type="bodyBold">Pregunta a SORA</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              SORA puede explicar diferencias de TER, score y categoría usando solo los datos
              visibles en esta comparación.
            </ThemedText>
            <Button
              label="Abrir chat de comparación"
              onPress={() => {
                setSoraSession((current) => current + 1);
                setIsSoraVisible(true);
              }}
              disabled={!canAskSora}
            />
          </View>

          <LegalNotice
            title="Aviso educativo"
            body="Esta comparación es orientativa. SORA no recomienda comprar ni vender productos y no modifica rankings ni scores."
          />
        </>
      )}

      <CompareFundPickerModal
        visible={isPickerVisible}
        selectedIsins={selectedIsins}
        canAddMore={canAddMore}
        onClose={() => setIsPickerVisible(false)}
        onSelectFund={(fund) => {
          void addFund(fund.isin);
        }}
      />

      <SoraChatSheet
        key={`compare-sora-${soraSession}`}
        visible={isSoraVisible}
        onClose={() => setIsSoraVisible(false)}
        surface="compare"
        fundIsins={selectedIsins}
        conversationMode
        quickPrompts={[
          '¿Qué diferencia hay en el TER?',
          '¿Esta comparación es homogénea?',
          '¿Cómo interpretar el Score Inversora aquí?',
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.lg,
  },
  headerBlock: {
    gap: Spacing.sm,
  },
  selectionBlock: {
    gap: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    maxWidth: '100%',
  },
  chipPressed: {
    opacity: 0.85,
  },
  soraBlock: {
    gap: Spacing.sm,
  },
});
