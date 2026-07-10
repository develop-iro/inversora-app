import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { ScrollView, StyleSheet, View, type View as ViewType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { parseOptionalFundIsinParam } from '@/core/domain/fund-isin';
import { CalculatorFundContextCard } from '@/features/calculator/components/calculator-fund-context-card';
import { CalculatorGrowthChart } from '@/features/calculator/components/calculator-growth-chart';
import { CalculatorInputForm } from '@/features/calculator/components/calculator-input-form';
import {
  CalculatorBreakdownLegend,
  CalculatorResultsSummary,
} from '@/features/calculator/components/calculator-results-summary';
import { CalculatorYearlyTable } from '@/features/calculator/components/calculator-yearly-table';
import { useCompoundInterestCalculator } from '@/features/calculator/hooks/use-compound-interest-calculator';
import { CompareFundPickerModal } from '@/features/comparison/components/compare-fund-picker-modal';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import {
  NAV_TAB_BAR_BOTTOM_GAP,
  NAV_TAB_BAR_HEIGHT,
} from '@/shared/components/navigation/nav-tab-bar';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { TabHeader } from '@/shared/components/ui';
import { Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';

function parseIsinParam(value: string | string[] | undefined): string | undefined {
  return parseOptionalFundIsinParam(value);
}

/**
 * Scrolls the parent `ScrollView` until `targetRef` is aligned below the top inset.
 */
function scrollToSection(
  scrollRef: RefObject<ScrollView | null>,
  containerRef: RefObject<ViewType | null>,
  targetRef: RefObject<ViewType | null>,
  topOffset: number = Spacing.lg,
) {
  const container = containerRef.current;
  const target = targetRef.current;

  if (!container || !target) {
    return;
  }

  target.measureLayout(
    container,
    (_x, y) => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, y - topOffset),
        animated: true,
      });
    },
    () => {},
  );
}

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ isin?: string | string[] }>();
  const initialIsin = parseIsinParam(params.isin);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<ViewType>(null);
  const resultsRef = useRef<ViewType>(null);
  const chartRef = useRef<ViewType>(null);
  const pendingScrollTargetRef = useRef<'results' | 'chart' | null>(null);

  const {
    mode,
    setMode,
    rateScenario,
    applyRateScenario,
    input,
    updateInput,
    selectedFund,
    fundRate,
    isFundLoading,
    fundError,
    selectFund,
    clearFund,
    result,
    hasCalculated,
    fieldErrors,
    calculate,
    reset,
  } = useCompoundInterestCalculator(initialIsin);

  const modeTabs = useMemo(
    () => [
      { value: 'free' as const, label: 'Escenario libre' },
      { value: 'fund' as const, label: 'Con fondo' },
    ],
    [],
  );

  const rateHint =
    mode === 'fund' && fundRate
      ? `Tipo sugerido a partir del histórico de ${fundRate.fundName}. Puedes editarlo manualmente.`
      : undefined;

  const scrollToResults = useCallback(() => {
    scrollToSection(scrollRef, contentRef, resultsRef, Spacing.lg);
  }, []);

  const scrollToChart = useCallback(() => {
    scrollToSection(scrollRef, contentRef, chartRef, Spacing.md);
  }, []);

  const handleCalculate = useCallback(() => {
    const didCalculate = calculate();

    if (didCalculate) {
      pendingScrollTargetRef.current = 'results';
    }
  }, [calculate]);

  const handleViewEvolution = useCallback(() => {
    pendingScrollTargetRef.current = 'chart';
    scrollToChart();
  }, [scrollToChart]);

  useEffect(() => {
    const target = pendingScrollTargetRef.current;

    if (!hasCalculated || !result || target === null) {
      return;
    }

    pendingScrollTargetRef.current = null;

    const runScroll = () => {
      if (target === 'chart') {
        scrollToChart();
        return;
      }

      scrollToResults();
    };

    requestAnimationFrame(() => {
      setTimeout(runScroll, 64);
    });
  }, [hasCalculated, result, scrollToChart, scrollToResults]);

  const bottomPadding =
    insets.bottom + NAV_TAB_BAR_HEIGHT + NAV_TAB_BAR_BOTTOM_GAP + Spacing.xl;

  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Spacing.xl,
            paddingBottom: bottomPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View ref={contentRef} style={styles.inner} collapsable={false}>
          <View style={styles.headerBlock}>
            <TextHeading variant="section">Calcular</TextHeading>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Simula el interés compuesto con escenarios claros y lenguaje sencillo. No es una
              recomendación de inversión.
            </TextParagraph>
          </View>

          <TabHeader
            accessibilityLabel="Modo de calculadora"
            tabs={modeTabs}
            value={mode}
            onChange={setMode}
          />

          {mode === 'fund' ? (
            <CalculatorFundContextCard
              selectedFund={selectedFund}
              fundRate={fundRate}
              isLoading={isFundLoading}
              errorMessage={fundError}
              onPickFund={() => setIsPickerVisible(true)}
              onClearFund={clearFund}
            />
          ) : null}

          <CalculatorInputForm
            input={input}
            fieldErrors={fieldErrors}
            rateScenario={rateScenario}
            showEducationalScenarios={mode === 'free'}
            onScenarioChange={applyRateScenario}
            onChange={updateInput}
            onCalculate={handleCalculate}
            onReset={reset}
            rateHint={rateHint}
          />

          {hasCalculated && result ? (
            <View ref={resultsRef} style={styles.resultsBlock} collapsable={false}>
              <CalculatorResultsSummary
                result={result}
                input={input}
                onViewEvolutionPress={handleViewEvolution}
              />
              <CalculatorBreakdownLegend breakdown={result.breakdown} />
              <View ref={chartRef} collapsable={false}>
                <CalculatorGrowthChart result={result} />
              </View>
              <CalculatorYearlyTable rows={result.rows} input={input} result={result} />
            </View>
          ) : null}

          <LegalNotice
            title="Simulación educativa"
            body="Los resultados usan un tipo de interés constante y no reflejan volatilidad, impuestos, comisiones de custodia ni costes de compraventa. El rendimiento pasado no garantiza resultados futuros."
          />
        </View>
      </ScrollView>

      <CompareFundPickerModal
        visible={isPickerVisible}
        selectedIsins={selectedFund ? [selectedFund.isin] : []}
        canAddMore
        onClose={() => setIsPickerVisible(false)}
        onSelectFund={(fund) => {
          void selectFund(fund);
          setIsPickerVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.lg,
  },
  headerBlock: {
    gap: Spacing.sm,
  },
  resultsBlock: {
    gap: Spacing.lg,
  },
});
