import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import type { FundPerformancePoint } from '@/core/domain/fund-market';
import {
  buildPerformanceChartCoordinates,
  buildYAxisTicks,
  downsamplePerformancePoints,
  formatChartAxisDate,
  formatChartTooltipDate,
  formatNavCurrency,
  getNearestPointIndex,
  indexedValueToNav,
  pickAxisLabelIndices,
  type ChartCoordinate,
} from '@/features/funds/utils/fund-performance';
import { TextLabel, TextLegal, TextParagraph } from '@/shared/components/text';
import { DISCLAIMER_PAST_PERFORMANCE } from '@/features/legal/constants/disclaimer-snippets';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeGradients } from '@/shared/hooks/use-theme-gradients';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';
import { Radius, Size, Spacing, Typography } from '@/shared/theme/theme';

const CHART_HEIGHT = 176;
const Y_AXIS_WIDTH = 40;
const X_AXIS_HEIGHT = 22;
const CHART_PADDING = 8;
const LINE_THICKNESS = 2.5;
const ACTIVE_DOT_SIZE = 10;
const CROSSHAIR_WIDTH = 1;

export type FundPerformanceChartProps = {
  points: FundPerformancePoint[];
  navBase: number;
  accessibilityLabel: string;
};

type ChartSegmentProps = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
};

function ChartSegment({ startX, startY, endX, endY, color }: ChartSegmentProps) {
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.hypot(dx, dy);

  if (length < 0.5) {
    return null;
  }

  const angle = `${(Math.atan2(dy, dx) * 180) / Math.PI}deg`;
  const centerX = (startX + endX) / 2;
  const centerY = (startY + endY) / 2;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.segment,
        {
          width: length,
          height: LINE_THICKNESS,
          left: centerX - length / 2,
          top: centerY - LINE_THICKNESS / 2,
          backgroundColor: color,
          transform: [{ rotate: angle }],
        },
      ]}
    />
  );
}

function coordinateForPointIndex(
  index: number,
  points: FundPerformancePoint[],
  plotWidth: number,
  plotHeight: number,
): ChartCoordinate | null {
  if (points.length === 0 || plotWidth <= 0) {
    return null;
  }

  const geometry = buildPerformanceChartCoordinates(points, plotWidth, plotHeight, CHART_PADDING);
  const point = points[index];
  if (!point) {
    return null;
  }

  const innerWidth = Math.max(plotWidth - CHART_PADDING * 2, 1);
  const innerHeight = Math.max(plotHeight - CHART_PADDING * 2, 1);
  const range = Math.max(geometry.maxValue - geometry.minValue, 0.6);
  const ratio = index / Math.max(points.length - 1, 1);

  return {
    x: CHART_PADDING + ratio * innerWidth,
    y:
      CHART_PADDING +
      innerHeight -
      ((point.value - geometry.minValue) / range) * innerHeight,
  };
}

export function FundPerformanceChart({
  points,
  navBase,
  accessibilityLabel,
}: FundPerformanceChartProps) {
  const theme = useTheme();
  const gradients = useThemeGradients();
  const shadows = useThemeShadows();
  const chartAreaFill = gradients.chartAreaFill;
  const [plotWidth, setPlotWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const renderPoints = useMemo(
    () => downsamplePerformancePoints(points, 64),
    [points],
  );

  const chartGeometry = useMemo(
    () => buildPerformanceChartCoordinates(renderPoints, plotWidth, CHART_HEIGHT, CHART_PADDING),
    [renderPoints, plotWidth],
  );

  const yAxisNavTicks = useMemo(() => {
    const minNav = indexedValueToNav(chartGeometry.minValue, navBase);
    const maxNav = indexedValueToNav(chartGeometry.maxValue, navBase);
    return buildYAxisTicks(minNav, maxNav, 4);
  }, [chartGeometry.maxValue, chartGeometry.minValue, navBase]);

  const xAxisLabels = useMemo(() => {
    const indices = pickAxisLabelIndices(renderPoints.length, 5);
    return indices.map((index) => ({
      index,
      label: formatChartAxisDate(renderPoints[index]?.date ?? ''),
    }));
  }, [renderPoints]);

  const hasChart = plotWidth > 0 && chartGeometry.coordinates.length > 1;

  const handlePlotLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setPlotWidth((current) => (current === nextWidth ? current : nextWidth));
  }, []);

  const updateActiveIndex = useCallback(
    (locationX: number) => {
      if (points.length === 0) {
        return;
      }
      const index = getNearestPointIndex(locationX, points.length, plotWidth, CHART_PADDING);
      setActiveIndex(index);
    },
    [plotWidth, points.length],
  );

  const handleScrubEnd = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const activePoint = activeIndex != null ? points[activeIndex] : null;
  const activeCoordinate =
    activeIndex != null
      ? coordinateForPointIndex(activeIndex, points, plotWidth, CHART_HEIGHT)
      : null;

  const activeNav =
    activePoint != null ? indexedValueToNav(activePoint.value, navBase) : null;

  const liveA11yLabel =
    activePoint && activeNav != null
      ? `${accessibilityLabel}. Valor liquidativo ${formatNavCurrency(activeNav)} el ${formatChartTooltipDate(activePoint.date)}.`
      : accessibilityLabel;

  const webPointerHandlers =
    Platform.OS === 'web'
      ? {
          onPointerMove: (event: { nativeEvent: { offsetX?: number; locationX?: number } }) => {
            const x = event.nativeEvent.offsetX ?? event.nativeEvent.locationX ?? 0;
            updateActiveIndex(x);
          },
          onPointerLeave: handleScrubEnd,
        }
      : undefined;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={liveA11yLabel}
      accessibilityHint="Desliza o pasa el cursor sobre el gráfico para ver el valor liquidativo en cada fecha"
      style={[styles.wrapper, { backgroundColor: theme.backgroundSoft }]}
    >
      <View style={styles.chartRow}>
        <View style={[styles.yAxis, { width: Y_AXIS_WIDTH, height: CHART_HEIGHT }]}>
          {hasChart
            ? yAxisNavTicks.map((tick) => (
                <TextLabel
                  key={tick}
                  variant="meta"
                  themeColor="textSecondary"
                  style={styles.yAxisLabel}
                >
                  {tick.toFixed(1).replace('.', ',')}
                </TextLabel>
              ))
            : null}
        </View>

        <View
          style={[styles.plotArea, { height: CHART_HEIGHT }]}
          onLayout={handlePlotLayout}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(event) => updateActiveIndex(event.nativeEvent.locationX)}
          onResponderMove={(event) => updateActiveIndex(event.nativeEvent.locationX)}
          onResponderRelease={handleScrubEnd}
          onResponderTerminate={handleScrubEnd}
          {...webPointerHandlers}
        >
          {hasChart ? (
            <View style={[styles.canvas, { width: plotWidth, height: CHART_HEIGHT }]}>
              <LinearGradient
                pointerEvents="none"
                colors={[...chartAreaFill.colors]}
                style={styles.areaFill}
              />
              {chartGeometry.coordinates.slice(1).map((end, index) => {
                const start = chartGeometry.coordinates[index];
                return (
                  <ChartSegment
                    key={`${start.x}-${start.y}-${end.x}-${end.y}`}
                    startX={start.x}
                    startY={start.y}
                    endX={end.x}
                    endY={end.y}
                    color={theme.primary}
                  />
                );
              })}

              {activeCoordinate && activePoint ? (
                <>
                  <View
                    pointerEvents="none"
                    style={[
                      styles.crosshair,
                      {
                        left: activeCoordinate.x - CROSSHAIR_WIDTH / 2,
                        height: CHART_HEIGHT - CHART_PADDING,
                        backgroundColor: theme.chartCrosshair,
                      },
                    ]}
                  />
                  <View
                    pointerEvents="none"
                    style={[
                      styles.activeDot,
                      {
                        left: activeCoordinate.x - ACTIVE_DOT_SIZE / 2,
                        top: activeCoordinate.y - ACTIVE_DOT_SIZE / 2,
                        backgroundColor: theme.primary,
                        borderColor: theme.surface,
                      },
                    ]}
                  />
                  <View
                    pointerEvents="none"
                    style={[
                      styles.valueTooltip,
                      shadows.tooltip,
                      {
                        left: Math.min(
                          Math.max(activeCoordinate.x - 72, Spacing.xs),
                          plotWidth - 148,
                        ),
                        top: Math.max(activeCoordinate.y - 52, Spacing.xs),
                        backgroundColor: theme.surface,
                        borderColor: theme.primary,
                      },
                    ]}
                  >
                    <TextLabel variant="meta" themeColor="textSecondary">
                      Valor liquidativo
                    </TextLabel>
                    <TextParagraph variant="emphasis" style={{ color: theme.deepOcean }}>
                      {formatNavCurrency(activeNav ?? 0)}
                    </TextParagraph>
                  </View>
                </>
              ) : null}
            </View>
          ) : (
            <View style={[styles.placeholder, { backgroundColor: theme.surfaceMuted }]} />
          )}
        </View>
      </View>

      {hasChart ? (
        <View style={[styles.xAxisRow, { marginLeft: Y_AXIS_WIDTH }]}>
          {xAxisLabels.map(({ index, label }) => {
            const ratio = index / Math.max(renderPoints.length - 1, 1);
            return (
              <TextLabel
                key={`${label}-${index}`}
                variant="meta"
                themeColor="textSecondary"
                style={[styles.xAxisLabel, { left: `${ratio * 100}%` }]}
              >
                {label}
              </TextLabel>
            );
          })}
        </View>
      ) : null}

      {activePoint ? (
        <View
          pointerEvents="none"
          style={[
            styles.dateChip,
            {
              marginLeft: Y_AXIS_WIDTH,
              backgroundColor: theme.deepOcean,
            },
          ]}
        >
          <TextLabel variant="meta" style={{ color: theme.surface }}>
            {formatChartTooltipDate(activePoint.date)}
          </TextLabel>
        </View>
      ) : (
        <TextLabel variant="meta" themeColor="textSecondary" style={styles.hint}>
          Valores liquidativos en EUR · Toca o desliza el gráfico para explorar
        </TextLabel>
      )}

      <TextLegal themeColor="textSecondary" style={styles.hint}>
        {DISCLAIMER_PAST_PERFORMANCE}
      </TextLegal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: Radius.card,
    overflow: 'hidden',
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingVertical: CHART_PADDING,
    paddingRight: Spacing.xs,
  },
  yAxisLabel: {
    ...Typography.chartAxis,
    textAlign: 'right',
  },
  plotArea: {
    flex: 1,
    minWidth: 0,
  },
  canvas: {
    position: 'relative',
    overflow: 'hidden',
  },
  areaFill: {
    ...StyleSheet.absoluteFill,
  },
  segment: {
    position: 'absolute',
    borderRadius: LINE_THICKNESS / 2,
  },
  crosshair: {
    position: 'absolute',
    top: CHART_PADDING,
    width: CROSSHAIR_WIDTH,
  },
  activeDot: {
    position: 'absolute',
    width: ACTIVE_DOT_SIZE,
    height: ACTIVE_DOT_SIZE,
    borderRadius: ACTIVE_DOT_SIZE / 2,
    borderWidth: 2,
  },
  valueTooltip: {
    position: 'absolute',
    minWidth: 120,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.chip,
    borderWidth: 1,
    gap: Spacing.half,
  },
  placeholder: {
    flex: 1,
    minHeight: CHART_HEIGHT,
    borderRadius: Radius.card,
  },
  xAxisRow: {
    position: 'relative',
    height: X_AXIS_HEIGHT,
    marginTop: Spacing.xs,
    marginRight: Spacing.sm,
  },
  xAxisLabel: {
    position: 'absolute',
    ...Typography.chartAxis,
    transform: [{ translateX: -Size.iconLg }],
    minWidth: Size.iconLg,
    textAlign: 'center',
  },
  dateChip: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
    marginHorizontal: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.chip,
  },
  hint: {
    marginHorizontal: Spacing.sm,
    marginTop: Spacing.xs,
  },
});
