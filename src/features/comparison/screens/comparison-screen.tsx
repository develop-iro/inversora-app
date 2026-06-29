import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MIN_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { CompareEmptyBody } from '@/features/comparison/components/compare-empty-body';
import { CompareFairnessBanner } from '@/features/comparison/components/compare-fairness-banner';
import { CompareFundPickerModal } from '@/features/comparison/components/compare-fund-picker-modal';
import { CompareFundVersusHeader } from '@/features/comparison/components/compare-fund-versus-header';
import { CompareLoadErrorsBanner } from '@/features/comparison/components/compare-load-errors-banner';
import { CompareLoadingSkeleton } from '@/features/comparison/components/compare-loading-skeleton';
import { CompareMetricsTable } from '@/features/comparison/components/compare-metrics-table';
import { ComparePartialSelectionHint } from '@/features/comparison/components/compare-partial-selection-hint';
import { CompareScoreBreakdownSection } from '@/features/comparison/components/compare-score-breakdown-section';
import { CompareSoraSection } from '@/features/comparison/components/compare-sora-section';
import { useCompareFunds } from '@/features/comparison/hooks/use-compare-funds';
import { useCompareSelection } from '@/features/comparison/hooks/use-compare-selection';
import { useFavoritesList } from '@/features/funds/hooks/use-favorites-list';
import { buildCompareQuickPrompts } from '@/features/comparison/utils/build-compare-quick-prompts';
import { buildCompareTableRows } from '@/features/comparison/utils/build-compare-table-rows';
import { evaluateCompareFairness } from '@/features/comparison/utils/evaluate-compare-fairness';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ScreenBodyIntro } from '@/shared/components/layout';
import { ThemedText } from '@/shared/components/themed-text';
import { SkeletonShimmerProvider } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { BottomTabInset, Layout, Spacing } from '@/shared/theme/theme';

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
  const { isins: favoriteIsins } = useFavoritesList();
  const { entries, loadedDetails, notFoundIsins, isLoading: isFundsLoading } =
    useCompareFunds(selectedIsins);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);
  const [soraInitialMessage, setSoraInitialMessage] = useState('');
  const hasSeededRef = useRef(false);

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

  const fairness = useMemo(() => evaluateCompareFairness(loadedDetails), [loadedDetails]);
  const tableRows = useMemo(() => buildCompareTableRows(loadedDetails), [loadedDetails]);
  const quickPrompts = useMemo(
    () => buildCompareQuickPrompts(loadedDetails, fairness),
    [loadedDetails, fairness],
  );

  const canCompare = loadedDetails.length >= MIN_COMPARE_FUNDS;
  const canAskSora = selectedIsins.length >= MIN_COMPARE_FUNDS;
  const isLoading = isSelectionLoading || isFundsLoading;
  const isEmpty = selectedIsins.length === 0;
  const needsSecondFund = selectedIsins.length === 1;

  const handleOpenPicker = useCallback(() => {
    setIsPickerVisible(true);
  }, []);

  const handleApplyPair = useCallback(
    (isins: readonly string[]) => {
      void setFunds(isins);
    },
    [setFunds],
  );

  const handleOpenSora = (initialMessage = '') => {
    setSoraInitialMessage(initialMessage);
    setSoraSession((current) => current + 1);
    setIsSoraVisible(true);
  };

  return (
    <SkeletonShimmerProvider>
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
          <ThemedText type="sectionTitle" themeColor="deepOcean">
            Comparar
          </ThemedText>
          <ScreenBodyIntro description="Vista educativa de métricas clave. No es recomendación de inversión." />
        </View>

        {isEmpty ? (
          <CompareEmptyBody
            favoriteIsins={favoriteIsins}
            onOpenPicker={handleOpenPicker}
            onApplyPair={handleApplyPair}
          />
        ) : null}

        {isLoading ? (
          <CompareLoadingSkeleton />
        ) : !isEmpty ? (
          <View style={styles.selectionBlock}>
            <CompareFundVersusHeader
              entries={entries}
              onRemoveFund={(isin) => {
                void removeFund(isin);
              }}
            />

            {canAddMore ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Añadir fondo"
                onPress={handleOpenPicker}
                style={({ pressed }) => pressed && styles.linkPressed}
              >
                <ThemedText type="caption" themeColor="primary" style={styles.addLink}>
                  + Añadir fondo
                </ThemedText>
              </Pressable>
            ) : (
              <ThemedText type="caption" themeColor="textSecondary">
                Máximo de fondos alcanzado.
              </ThemedText>
            )}
          </View>
        ) : null}

        {!isLoading && needsSecondFund ? (
          <ComparePartialSelectionHint
            onOpenPicker={handleOpenPicker}
            onApplyPair={handleApplyPair}
          />
        ) : null}

        {!isLoading && selectedIsins.length > 0 ? (
          <>
            <CompareLoadErrorsBanner notFoundIsins={notFoundIsins} />

            {canCompare ? (
              <>
                <CompareFairnessBanner fairness={fairness} />
                <CompareMetricsTable details={loadedDetails} rows={tableRows} />
                <CompareScoreBreakdownSection details={loadedDetails} />
              </>
            ) : null}

            <CompareSoraSection
              selectedIsins={selectedIsins}
              quickPrompts={quickPrompts}
              canAskSora={canAskSora}
              isSoraVisible={isSoraVisible}
              soraSession={soraSession}
              soraInitialMessage={soraInitialMessage}
              onOpenChat={handleOpenSora}
              onCloseChat={() => setIsSoraVisible(false)}
            />
          </>
        ) : null}

        <LegalNotice
          title="Aviso educativo"
          body="Esta comparación es orientativa. SORA no recomienda comprar ni vender productos y no modifica rankings ni scores."
        />

        <CompareFundPickerModal
          visible={isPickerVisible}
          selectedIsins={selectedIsins}
          canAddMore={canAddMore}
          onClose={() => setIsPickerVisible(false)}
          onSelectFund={(fund) => {
            void addFund(fund.isin);
          }}
        />
      </ScrollView>
    </SkeletonShimmerProvider>
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
  addLink: {
    textAlign: 'center',
  },
  linkPressed: {
    opacity: 0.85,
  },
});
