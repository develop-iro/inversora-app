import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { toast } from '@/core/overlay';

import type {
  CompoundInterestInput,
  CompoundInterestResult,
  CompoundInterestYearRow,
} from '@/features/calculator/models/compound-interest.engine';
import { formatCalculatorCurrency } from '@/features/calculator/models/compound-interest.engine';
import { exportCalculatorSimulation } from '@/features/calculator/services/export-calculator-simulation';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeGradients } from '@/shared/hooks/use-theme-gradients';
import { cn } from '@/shared/utils/cn';

export type CalculatorYearlyTableProps = {
  rows: readonly CompoundInterestYearRow[];
  input: CompoundInterestInput;
  result: CompoundInterestResult;
};

const COLUMNS = [
  { key: 'year', label: 'Año', flex: 0.7 },
  { key: 'periodicDepositsThisYear', label: 'Aport. año', flex: 1.2 },
  { key: 'cumulativeDeposits', label: 'Aport. total', flex: 1.2 },
  { key: 'interestThisYear', label: 'Interés año', flex: 1.1 },
  { key: 'balance', label: 'Balance', flex: 1.2 },
] as const;

const SCROLL_EDGE_THRESHOLD = 8;

/**
 * Year-by-year table for the compound interest simulation.
 */
export function CalculatorYearlyTable({ rows, input, result }: CalculatorYearlyTableProps) {
  const theme = useTheme();
  const gradients = useThemeGradients();
  const scrollFade = gradients.scrollFadeHorizontal;
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollOffsetX, setScrollOffsetX] = useState(0);

  const updateScrollAffordance = useCallback(
    (offsetX: number, nextContentWidth: number, nextViewportWidth: number) => {
      const hasOverflow = nextContentWidth > nextViewportWidth + SCROLL_EDGE_THRESHOLD;
      const atEnd = offsetX + nextViewportWidth >= nextContentWidth - SCROLL_EDGE_THRESHOLD;
      setCanScrollRight(hasOverflow && !atEnd);
    },
    [],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      setScrollOffsetX(offsetX);
      updateScrollAffordance(offsetX, contentWidth, viewportWidth);
    },
    [contentWidth, updateScrollAffordance, viewportWidth],
  );

  const handleViewportLayout = useCallback(
    (width: number) => {
      setViewportWidth(width);
      updateScrollAffordance(scrollOffsetX, contentWidth, width);
    },
    [contentWidth, scrollOffsetX, updateScrollAffordance],
  );

  const handleContentSizeChange = useCallback(
    (width: number) => {
      setContentWidth(width);
      updateScrollAffordance(scrollOffsetX, width, viewportWidth);
    },
    [scrollOffsetX, updateScrollAffordance, viewportWidth],
  );

  const handleExportPress = useCallback(async () => {
    setIsExporting(true);

    try {
      const exportResult = await exportCalculatorSimulation(input, result);

      if (exportResult.status === 'downloaded') {
        toast.success('Se ha descargado un archivo CSV compatible con Excel.', {
          title: 'Simulación exportada',
        });
        return;
      }

      if (exportResult.status === 'shared') {
        return;
      }

      if (exportResult.status === 'copied') {
        toast.info(
          'No pudimos abrir el menú de compartir. Los datos se copiaron al portapapeles para pegarlos en Excel o Google Sheets.',
          {
            title: 'Simulación copiada',
          },
        );
        return;
      }

      toast.error(exportResult.message, {
        title: 'Exportación no disponible',
      });
    } finally {
      setIsExporting(false);
    }
  }, [input, result]);

  const showScrollHint = contentWidth > viewportWidth + SCROLL_EDGE_THRESHOLD;

  return (
    <View className="gap-md">
      <View className="flex-row items-start justify-between gap-md">
        <View className="flex-1 gap-xs">
          <TextParagraph variant="emphasis">Detalle anual</TextParagraph>
          {showScrollHint ? (
            <View className="flex-row items-center gap-xs">
              <MaterialCommunityIcons
                name="gesture-swipe-horizontal"
                size={14}
                color={theme.textSecondary}
              />
              <TextParagraph variant="secondary" themeColor="textSecondary">
                Desliza horizontalmente para ver todas las columnas
              </TextParagraph>
            </View>
          ) : null}
        </View>

        <Button
          label="Exportar CSV"
          variant="outline"
          size="sm"
          loading={isExporting}
          accessibilityLabel="Exportar simulación en formato CSV"
          accessibilityHint="Descarga o comparte la simulación para abrirla en Excel o Google Sheets"
          onPress={() => {
            void handleExportPress();
          }}
        />
      </View>

      <View
        className="relative"
        onLayout={(event) => {
          handleViewportLayout(event.nativeEvent.layout.width);
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={Platform.OS === 'web'}
          accessibilityLabel="Tabla de detalle anual"
          accessibilityHint="Desliza horizontalmente para ver interés y balance de cada año"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(width) => {
            handleContentSizeChange(width);
          }}
          contentContainerClassName="pb-xs"
        >
          <View className="min-w-[560px] overflow-hidden rounded-card border border-border bg-surface">
            <View className="flex-row border-b border-border bg-background-soft px-sm py-sm">
              {COLUMNS.map((column) => (
                <TextLabel
                  key={column.key}
                  variant="meta"
                  themeColor="textSecondary"
                  className="px-xs font-semibold"
                  style={{ flex: column.flex }}
                >
                  {column.label}
                </TextLabel>
              ))}
            </View>

            {rows.map((row, index) => {
              const isEvenRow = index % 2 === 0;

              return (
                <View
                  key={row.year}
                  className={cn(
                    'flex-row border-t border-border px-sm py-sm',
                    isEvenRow ? 'bg-surface' : 'bg-background-soft',
                  )}
                >
                  <TextParagraph variant="secondary" className="px-xs" style={{ flex: COLUMNS[0].flex }}>
                    {row.year}
                  </TextParagraph>
                  <TextParagraph variant="secondary" className="px-xs" style={{ flex: COLUMNS[1].flex }}>
                    {formatCalculatorCurrency(row.periodicDepositsThisYear)}
                  </TextParagraph>
                  <TextParagraph variant="secondary" className="px-xs" style={{ flex: COLUMNS[2].flex }}>
                    {formatCalculatorCurrency(row.cumulativeDeposits)}
                  </TextParagraph>
                  <TextParagraph variant="secondary" className="px-xs" style={{ flex: COLUMNS[3].flex }}>
                    {formatCalculatorCurrency(row.interestThisYear)}
                  </TextParagraph>
                  <TextParagraph variant="emphasis" className="px-xs" style={{ flex: COLUMNS[4].flex }}>
                    {formatCalculatorCurrency(row.balance)}
                  </TextParagraph>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {canScrollRight ? (
          <View pointerEvents="none" className="absolute bottom-0 right-0 top-0 w-14 items-end justify-center" accessibilityElementsHidden>
            <LinearGradient
              colors={[...scrollFade.colors]}
              start={scrollFade.start}
              end={scrollFade.end}
              // tailwind-exception: gradient overlay uses absolute fill for scroll fade
              style={StyleSheet.absoluteFill}
            />
            <View className="mr-xs h-7 w-7 items-center justify-center rounded-full border border-border bg-surface">
              <MaterialCommunityIcons name="chevron-right" size={16} color={theme.deepOcean} />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
