import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import { Platform, View, type LayoutChangeEvent } from 'react-native';

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
import { Size, Spacing } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

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
  className?: string;
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
      className="absolute rounded-full"
      // tailwind-exception: chart segment geometry is computed at runtime
      style={{
        width: length,
        height: LINE_THICKNESS,
        left: centerX - length / 2,
        top: centerY - LINE_THICKNESS / 2,
        backgroundColor: color,
        transform: [{ rotate: angle }],
      }}
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
  className,
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
      className={cn('w-full gap-xs overflow-hidden rounded-card bg-background-soft py-sm', className)}
    >
      <View className="flex-row items-stretch">
        <View
          className="justify-between py-2 pr-xs"
          // tailwind-exception: y-axis width is fixed for chart layout
          style={{ width: Y_AXIS_WIDTH, height: CHART_HEIGHT }}
        >
          {hasChart
            ? yAxisNavTicks.map((tick) => (
                <TextLabel
                  key={tick}
                  variant="meta"
                  themeColor="textSecondary"
                  className="text-right font-display text-chartAxis"
                >
                  {tick.toFixed(1).replace('.', ',')}
                </TextLabel>
              ))
            : null}
        </View>

        <View
          className="min-w-0 flex-1"
          // tailwind-exception: plot height is fixed for chart geometry
          style={{ height: CHART_HEIGHT }}
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
            <View
              className="relative overflow-hidden"
              // tailwind-exception: canvas size matches measured plot width
              style={{ width: plotWidth, height: CHART_HEIGHT }}
            >
              <LinearGradient
                pointerEvents="none"
                colors={[...chartAreaFill.colors]}
                className="absolute inset-0"
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
                    className="absolute"
                    // tailwind-exception: crosshair position follows active data point
                    style={{
                      left: activeCoordinate.x - CROSSHAIR_WIDTH / 2,
                      top: CHART_PADDING,
                      height: CHART_HEIGHT - CHART_PADDING,
                      width: CROSSHAIR_WIDTH,
                      backgroundColor: theme.chartCrosshair,
                    }}
                  />
                  <View
                    pointerEvents="none"
                    className="absolute rounded-full border-2"
                    // tailwind-exception: active dot position follows scrub index
                    style={{
                      left: activeCoordinate.x - ACTIVE_DOT_SIZE / 2,
                      top: activeCoordinate.y - ACTIVE_DOT_SIZE / 2,
                      width: ACTIVE_DOT_SIZE,
                      height: ACTIVE_DOT_SIZE,
                      backgroundColor: theme.primary,
                      borderColor: theme.surface,
                    }}
                  />
                  <View
                    pointerEvents="none"
                    className="absolute min-w-[120px] gap-half rounded-chip border border-primary bg-surface px-sm py-xs"
                    // tailwind-exception: tooltip position tracks crosshair within plot bounds
                    style={[
                      shadows.tooltip,
                      {
                        left: Math.min(
                          Math.max(activeCoordinate.x - 72, Spacing.xs),
                          plotWidth - 148,
                        ),
                        top: Math.max(activeCoordinate.y - 52, Spacing.xs),
                      },
                    ]}
                  >
                    <TextLabel variant="meta" themeColor="textSecondary">
                      Valor liquidativo
                    </TextLabel>
                    <TextParagraph variant="emphasis" themeColor="deepOcean">
                      {formatNavCurrency(activeNav ?? 0)}
                    </TextParagraph>
                  </View>
                </>
              ) : null}
            </View>
          ) : (
            <View className="min-h-[176px] flex-1 rounded-card bg-surface-muted" />
          )}
        </View>
      </View>

      {hasChart ? (
        <View
          className="relative mr-sm mt-xs"
          // tailwind-exception: x-axis row aligns with y-axis gutter
          style={{ marginLeft: Y_AXIS_WIDTH, height: X_AXIS_HEIGHT }}
        >
          {xAxisLabels.map(({ index, label }) => {
            const ratio = index / Math.max(renderPoints.length - 1, 1);
            return (
              <TextLabel
                key={`${label}-${index}`}
                variant="meta"
                themeColor="textSecondary"
                className="absolute min-w-8 text-center font-display text-chartAxis"
                // tailwind-exception: axis labels are positioned by data index ratio
                style={{
                  left: `${ratio * 100}%`,
                  transform: [{ translateX: -Size.iconLg }],
                }}
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
          className="mt-xs self-start rounded-chip bg-deep-ocean px-sm py-xs"
          // tailwind-exception: date chip aligns with y-axis gutter
          style={{ marginLeft: Y_AXIS_WIDTH, marginHorizontal: Spacing.sm }}
        >
          <TextLabel variant="meta" themeColor="surface">
            {formatChartTooltipDate(activePoint.date)}
          </TextLabel>
        </View>
      ) : (
        <TextLabel variant="meta" themeColor="textSecondary" className="mx-sm mt-xs">
          Valores liquidativos en EUR · Toca o desliza el gráfico para explorar
        </TextLabel>
      )}

      <TextLegal themeColor="textSecondary" className="mx-sm mt-xs">
        {DISCLAIMER_PAST_PERFORMANCE}
      </TextLegal>
    </View>
  );
}
