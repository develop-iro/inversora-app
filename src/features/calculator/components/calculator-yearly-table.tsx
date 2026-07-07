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
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { palette } from '@/shared/theme/palette';
import { Radius, Spacing } from '@/shared/theme/theme';

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
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <ThemedText type="bodyBold">Detalle anual</ThemedText>
          {showScrollHint ? (
            <View style={styles.scrollHintRow}>
              <MaterialCommunityIcons
                name="gesture-swipe-horizontal"
                size={14}
                color={theme.textSecondary}
              />
              <ThemedText type="caption" themeColor="textSecondary">
                Desliza horizontalmente para ver todas las columnas
              </ThemedText>
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
        style={styles.tableViewport}
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
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.table, { borderColor: theme.border }]}>
            <View
              style={[
                styles.tableHeaderRow,
                {
                  backgroundColor: theme.backgroundSoft,
                  borderBottomColor: theme.border,
                },
              ]}
            >
              {COLUMNS.map((column) => (
                <ThemedText
                  key={column.key}
                  type="metaLabel"
                  themeColor="textSecondary"
                  style={[styles.cell, styles.headerCell, { flex: column.flex }]}
                >
                  {column.label}
                </ThemedText>
              ))}
            </View>

            {rows.map((row, index) => {
              const isEvenRow = index % 2 === 0;

              return (
                <View
                  key={row.year}
                  style={[
                    styles.dataRow,
                    {
                      backgroundColor: isEvenRow ? theme.surface : palette.softTealBackground,
                      borderTopColor: theme.border,
                    },
                  ]}
                >
                  <ThemedText type="caption" style={[styles.cell, { flex: COLUMNS[0].flex }]}>
                    {row.year}
                  </ThemedText>
                  <ThemedText type="caption" style={[styles.cell, { flex: COLUMNS[1].flex }]}>
                    {formatCalculatorCurrency(row.periodicDepositsThisYear)}
                  </ThemedText>
                  <ThemedText type="caption" style={[styles.cell, { flex: COLUMNS[2].flex }]}>
                    {formatCalculatorCurrency(row.cumulativeDeposits)}
                  </ThemedText>
                  <ThemedText type="caption" style={[styles.cell, { flex: COLUMNS[3].flex }]}>
                    {formatCalculatorCurrency(row.interestThisYear)}
                  </ThemedText>
                  <ThemedText type="bodyBold" style={[styles.cell, { flex: COLUMNS[4].flex }]}>
                    {formatCalculatorCurrency(row.balance)}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {canScrollRight ? (
          <View pointerEvents="none" style={styles.fadeEdge} accessibilityElementsHidden>
            <LinearGradient
              colors={['rgba(248, 250, 249, 0)', 'rgba(248, 250, 249, 0.92)', palette.neutralBackground]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.fadeGradient}
            />
            <View style={[styles.fadeChevron, { borderColor: theme.border }]}>
              <MaterialCommunityIcons name="chevron-right" size={16} color={theme.deepOcean} />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
  scrollHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tableViewport: {
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: Spacing.xs,
  },
  table: {
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
    minWidth: 560,
    backgroundColor: palette.white,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dataRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  cell: {
    paddingHorizontal: Spacing.xs,
  },
  headerCell: {
    fontWeight: '600',
  },
  fadeEdge: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 56,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  fadeGradient: {
    ...StyleSheet.absoluteFill,
  },
  fadeChevron: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 1,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
});
