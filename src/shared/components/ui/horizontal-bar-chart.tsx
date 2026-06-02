import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

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

const CHART_HEIGHT = 200;
const BAR_MAX_HEIGHT = 160;
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
              <ThemedText key={step} type="caption" themeColor="textSecondary" style={styles.yLabel}>
                {step}
              </ThemedText>
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
                  bottom: (step / scaleMax) * BAR_MAX_HEIGHT,
                  backgroundColor: theme.border,
                },
              ]}
            />
          ))}
          <View style={styles.barsRow}>
            {data.map((datum) => {
              const hasValue = datum.value != null;
              const height = hasValue
                ? Math.max(4, (datum.value! / scaleMax) * BAR_MAX_HEIGHT)
                : 0;

              return (
                <View key={datum.id} style={styles.barColumn}>
                  {hasValue ? (
                    <ThemedText type="caption" style={styles.barValue}>
                      {formatBarValue(datum.value!)}
                    </ThemedText>
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
                  <ThemedText
                    type="caption"
                    themeColor="textSecondary"
                    style={styles.xLabel}
                    numberOfLines={2}
                  >
                    {datum.label}
                  </ThemedText>
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
    minHeight: CHART_HEIGHT,
    alignSelf: 'stretch',
  },
  chartRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  yAxis: {
    width: 28,
    height: BAR_MAX_HEIGHT + 48,
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 40,
  },
  yLabel: {
    fontSize: 10,
    lineHeight: 12,
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
    paddingTop: 20,
    minHeight: BAR_MAX_HEIGHT + 56,
  },
  barColumn: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  barValue: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  barValuePlaceholder: {
    height: 14,
  },
  barTrack: {
    height: BAR_MAX_HEIGHT,
    width: '72%',
    maxWidth: 44,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: Radius.image,
    borderTopRightRadius: Radius.image,
    minWidth: 12,
  },
  xLabel: {
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
  },
});
