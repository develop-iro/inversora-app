import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { trackEvent } from '@/core/analytics/track-event';
import { parseFundIsinList } from '@/core/domain/fund-isin';
import { MIN_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { CompareEmptyBody } from '@/features/comparison/components/compare-empty-body';
import { CompareFairnessBanner } from '@/features/comparison/components/compare-fairness-banner';
import { CompareFundPickerModal } from '@/features/comparison/components/compare-fund-picker-modal';
import { CompareLoadErrorsBanner } from '@/features/comparison/components/compare-load-errors-banner';
import { CompareLoadingSkeleton } from '@/features/comparison/components/compare-loading-skeleton';
import { CompareMetricsTable } from '@/features/comparison/components/compare-metrics-table';
import { CompareScoreBreakdownSection } from '@/features/comparison/components/compare-score-breakdown-section';
import { CompareSelectionPanel } from '@/features/comparison/components/compare-selection-panel';
import { CompareSoraSection } from '@/features/comparison/components/compare-sora-section';
import { useCompareFunds } from '@/features/comparison/hooks/use-compare-funds';
import { useCompareSelection } from '@/features/comparison/hooks/use-compare-selection';
import { useFavoritesList } from '@/features/funds/hooks/use-favorites-list';
import { buildCompareQuickPrompts } from '@/features/comparison/utils/build-compare-quick-prompts';
import { buildCompareTableRows } from '@/features/comparison/utils/build-compare-table-rows';
import { areCompareFundsOutOfSync } from '@/features/comparison/utils/compare-funds-sync';
import { evaluateCompareFairness } from '@/features/comparison/utils/evaluate-compare-fairness';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { SectionCard, TabScreenScroll } from '@/shared/components/layout';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { SlowRequestReloadState } from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useSlowRequestNotice } from '@/shared/hooks/use-slow-request-notice';
import { Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';

function parseIsinsParam(value: string | string[] | undefined): string[] {
  if (value === undefined) {
    return [];
  }

  const raw = Array.isArray(value) ? value.join(',') : value;

  return parseFundIsinList(
    raw
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0),
  );
}

export default function ComparisonScreen() {
  const { contentWidth } = useMobileLayout();
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
  const { entries, loadedDetails, notFoundIsins, isLoading: isFundsLoading, reloadToken, refetch } =
    useCompareFunds(selectedIsins);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);
  const [soraInitialMessage, setSoraInitialMessage] = useState('');
  const lastSeededIsinsRef = useRef<string>('');

  useEffect(() => {
    if (isSelectionLoading) {
      return;
    }

    const seededIsins = parseIsinsParam(params.isins);

    if (seededIsins.length === 0) {
      return;
    }

    const seedKey = seededIsins.join(',');

    if (lastSeededIsinsRef.current === seedKey) {
      return;
    }

    lastSeededIsinsRef.current = seedKey;
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
  const isFundsOutOfSync = areCompareFundsOutOfSync(selectedIsins, entries);
  const isEmpty = selectedIsins.length === 0;
  const isLoading = isSelectionLoading || isFundsLoading || isFundsOutOfSync;
  const { isSlow: isCompareLoadSlow } = useSlowRequestNotice({
    isLoading: !isEmpty && isLoading,
    loadingKey: reloadToken,
  });
  const needsSecondFund = selectedIsins.length === 1;
  const hasTrackedCompareRef = useRef(false);

  useEffect(() => {
    if (!canCompare || isLoading || hasTrackedCompareRef.current) {
      return;
    }

    hasTrackedCompareRef.current = true;
    void trackEvent('compare_completed', 'compare', {
      fundCount: loadedDetails.length,
      isFair: fairness.isFair,
    });
  }, [canCompare, fairness.isFair, isLoading, loadedDetails.length]);

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
    <TabScreenScroll
      extraBottomPadding={Spacing.xl}
      contentContainerClassName="items-center pt-lg"
      showsVerticalScrollIndicator={false}
    >
      <View
        className="w-full gap-lg self-center px-lg"
        style={{
          width: contentWidth,
          maxWidth: MaxContentWidth,
          paddingHorizontal: Layout.screenPaddingHorizontal,
        }}
      >
        <View className="gap-sm">
          <TextHeading variant="section" themeColor="deepOcean">
            Comparar
          </TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Vista educativa de métricas clave. No es recomendación de inversión.
          </TextParagraph>
        </View>

        {isEmpty ? (
          <CompareEmptyBody
            favoriteIsins={favoriteIsins}
            onOpenPicker={handleOpenPicker}
            onApplyPair={handleApplyPair}
          />
        ) : null}

        {isLoading ? (
          isCompareLoadSlow ? (
            <SlowRequestReloadState onRetry={refetch} layout="section" className="w-full" />
          ) : (
            <CompareLoadingSkeleton />
          )
        ) : !isEmpty ? (
          <CompareSelectionPanel
            entries={entries}
            selectedCount={selectedIsins.length}
            needsSecondFund={needsSecondFund}
            canAddMore={canAddMore}
            onRemoveFund={(isin) => {
              void removeFund(isin);
            }}
            onOpenPicker={handleOpenPicker}
            onApplyPair={handleApplyPair}
          />
        ) : null}

        {!isLoading && selectedIsins.length > 0 ? (
          <>
            <CompareLoadErrorsBanner notFoundIsins={notFoundIsins} />

            {canCompare ? (
              <SectionCard
                title="Resultados comparativos"
                summary="Métricas alineadas para una lectura educativa entre fondos."
                borderless
              >
                <CompareFairnessBanner fairness={fairness} />
                <CompareMetricsTable details={loadedDetails} rows={tableRows} />
                <CompareScoreBreakdownSection details={loadedDetails} />
              </SectionCard>
            ) : null}

            {canAskSora ? (
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
            ) : null}
          </>
        ) : null}

        <LegalNotice
          className="mt-md py-md"
          title="Aviso educativo"
          body="Esta comparación es orientativa. SORA no recomienda comprar ni vender productos y no modifica rankings ni scores."
        />

        <CompareFundPickerModal
          visible={isPickerVisible}
          selectedIsins={selectedIsins}
          canAddMore={canAddMore}
          onClose={() => setIsPickerVisible(false)}
          onSelectFund={async (fund) => {
            await addFund(fund.isin);
          }}
        />
      </View>
    </TabScreenScroll>
  );
}
