import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { ScrollView, View, type View as ViewType } from 'react-native';

import { parseOptionalFundIsinParam } from '@/core/domain/fund-isin';
import { CalculatorBreakdownDonut } from '@/features/calculator/components/calculator-breakdown-donut';
import { CalculatorFundContextCard } from '@/features/calculator/components/calculator-fund-context-card';
import { CalculatorInputForm } from '@/features/calculator/components/calculator-input-form';
import { CalculatorResultsSummary } from '@/features/calculator/components/calculator-results-summary';
import { CalculatorYearlyTable } from '@/features/calculator/components/calculator-yearly-table';
import { useCompoundInterestCalculator } from '@/features/calculator/hooks/use-compound-interest-calculator';
import { CompareFundPickerModal } from '@/features/comparison/components/compare-fund-picker-modal';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { TabScreenScroll } from '@/shared/components/layout';
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
  const params = useLocalSearchParams<{ isin?: string | string[] }>();
  const initialIsin = parseIsinParam(params.isin);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<ViewType>(null);
  const resultsRef = useRef<ViewType>(null);
  const tableRef = useRef<ViewType>(null);
  const pendingScrollTargetRef = useRef<'results' | 'table' | null>(null);

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
    loadFromIsin,
  } = useCompoundInterestCalculator();

  useFocusEffect(
    useCallback(() => {
      reset();
      scrollRef.current?.scrollTo({ y: 0, animated: false });

      if (initialIsin !== undefined) {
        void loadFromIsin(initialIsin);
      }

      return () => {
        reset();
      };
    }, [initialIsin, loadFromIsin, reset]),
  );

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

  const scrollToTable = useCallback(() => {
    scrollToSection(scrollRef, contentRef, tableRef, Spacing.md);
  }, []);

  const handleCalculate = useCallback(() => {
    const didCalculate = calculate();

    if (didCalculate) {
      pendingScrollTargetRef.current = 'results';
    }
  }, [calculate]);

  const handleViewYearlyDetail = useCallback(() => {
    pendingScrollTargetRef.current = 'table';
    scrollToTable();
  }, [scrollToTable]);

  useEffect(() => {
    const target = pendingScrollTargetRef.current;

    if (!hasCalculated || !result || target === null) {
      return;
    }

    pendingScrollTargetRef.current = null;

    const runScroll = () => {
      if (target === 'table') {
        scrollToTable();
        return;
      }

      scrollToResults();
    };

    requestAnimationFrame(() => {
      setTimeout(runScroll, 64);
    });
  }, [hasCalculated, result, scrollToTable, scrollToResults]);

  return (
    <>
      <TabScreenScroll
        ref={scrollRef}
        extraBottomPadding={Spacing.xl}
        contentContainerClassName="items-center"
        contentContainerStyle={{
          paddingTop: Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          ref={contentRef}
          className="w-full gap-lg"
          style={{
            maxWidth: MaxContentWidth,
            paddingHorizontal: Layout.screenPaddingHorizontal,
          }}
          collapsable={false}
        >
          <View className="gap-sm">
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
            <View ref={resultsRef} className="gap-lg" collapsable={false}>
              <CalculatorResultsSummary
                result={result}
                input={input}
                onViewYearlyDetailPress={handleViewYearlyDetail}
              />
              <CalculatorBreakdownDonut result={result} />
              <View ref={tableRef} collapsable={false}>
                <CalculatorYearlyTable rows={result.rows} input={input} result={result} />
              </View>
            </View>
          ) : null}

          <LegalNotice
            title="Simulación educativa"
            body="Los resultados usan un tipo de interés constante y no reflejan volatilidad, impuestos, comisiones de custodia ni costes de compraventa. El rendimiento pasado no garantiza resultados futuros."
          />
        </View>
      </TabScreenScroll>

      <CompareFundPickerModal
        visible={isPickerVisible}
        selectedIsins={selectedFund ? [selectedFund.isin] : []}
        canAddMore
        onClose={() => setIsPickerVisible(false)}
        onSelectFund={async (fund) => {
          await selectFund(fund);
        }}
      />
    </>
  );
}
