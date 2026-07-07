import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { ChartMetrics } from '@/shared/theme/chart-metrics';
import { Radius, Size, Spacing, Typography } from '@/shared/theme/theme';

export type HorizontalBarDatum = {
  id: string;
  label: string;
  value: number | null;
};

export type HorizontalBarChartProps = {
  data: HorizontalBarDatum[];
  accessibilityLabel: string;
  maxValue?: number;
};

const Y_AXIS_STEPS = [0, 5, 10, 15, 20, 25, 30];

function formatBarValue(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export function HorizontalBarChart({
  data,
  accessibilityLabel,
  maxValue = 30,
}: HorizontalBarChartProps) {
  const theme = useTheme();

  const scaleMax = useMemo(() => {
    const values = data
      .map((d) => d.value)
      .filter((v): v is number => v != null);
    if (values.length === 0) {
      return maxValue;
    }
    const peak = Math.max(...values, 0);
    return Math.max(maxValue, Math.ceil(peak / 5) * 5);
  }, [data, maxValue]);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={styles.wrapper}
    >
      <View style={styles.chartRow}>
        <View style={styles.yAxis}>
          {[...Y_AXIS_STEPS].reverse().map((step) =>
            step <= scaleMax ? (
              <TextParagraph key={step} variant="secondary" themeColor="textSecondary" style={styles.yLabel}>
                {step}
              </TextParagraph>
            ) : null,
          )}
        </View>
        <View style={styles.plot}>
          {Y_AXIS_STEPS.filter((s) => s <= scaleMax && s > 0).map((step) => (
            <View
              key={step}
              pointerEvents="none"
              style={[
                styles.gridLine,
                {
                  bottom: (step / scaleMax) * ChartMetrics.barMaxHeight,
                  backgroundColor: theme.border,
                },
              ]}
            />
          ))}
          <View style={styles.barsRow}>
            {data.map((datum) => {
              const hasValue = datum.value != null;
              const height = hasValue
                ? Math.max(ChartMetrics.barMinHeight, (datum.value! / scaleMax) * ChartMetrics.barMaxHeight)
                : 0;

              return (
                <View key={datum.id} style={styles.barColumn}>
                  {hasValue ? (
                    <TextParagraph variant="secondary" style={styles.barValue}>
                      {formatBarValue(datum.value!)}
                    </TextParagraph>
                  ) : (
                    <View style={styles.barValuePlaceholder} />
                  )}
                  <View style={styles.barTrack}>
                    {hasValue ? (
                      <View
                        style={[
                          styles.bar,
                          {
                            height,
                            backgroundColor: theme.primary,
                          },
                        ]}
                      />
                    ) : null}
                  </View>
                  <TextParagraph
                    variant="secondary"
                    themeColor="textSecondary"
                    style={styles.xLabel}
                    numberOfLines={2}
                  >
                    {datum.label}
                  </TextParagraph>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: ChartMetrics.height,
    alignSelf: 'stretch',
  },
  chartRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  yAxis: {
    width: ChartMetrics.yAxisWidth,
    height: ChartMetrics.barMaxHeight + ChartMetrics.yAxisPaddingTop + ChartMetrics.yAxisPaddingBottom,
    justifyContent: 'space-between',
    paddingTop: ChartMetrics.yAxisPaddingTop,
    paddingBottom: ChartMetrics.yAxisPaddingBottom,
  },
  yLabel: {
    ...Typography.chartAxis,
  },
  plot: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    paddingTop: ChartMetrics.yAxisPaddingTop,
    minHeight: ChartMetrics.barMaxHeight + ChartMetrics.labelAreaHeight,
  },
  barColumn: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  barValue: {
    ...Typography.chartLabel,
    textAlign: 'center',
  },
  barValuePlaceholder: {
    height: Size.chartBarValue,
  },
  barTrack: {
    height: ChartMetrics.barMaxHeight,
    width: '72%',
    maxWidth: ChartMetrics.barTrackMaxWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: Radius.image,
    borderTopRightRadius: Radius.image,
    minWidth: ChartMetrics.barMinWidth,
  },
  xLabel: {
    ...Typography.chartAxis,
    lineHeight: Typography.micro.lineHeight,
    textAlign: 'center',
  },
});
