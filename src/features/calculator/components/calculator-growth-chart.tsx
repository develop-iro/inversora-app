import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { CompoundInterestResult } from '@/features/calculator/models/compound-interest.engine';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CalculatorGrowthChartProps = {
  result: CompoundInterestResult;
};

const CHART_HEIGHT = 180;
const BAR_MAX_HEIGHT = 140;

/**
 * Stacked bar chart showing balance composition by year.
 */
export function CalculatorGrowthChart({ result }: CalculatorGrowthChartProps) {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const maxBalance = Math.max(...result.rows.map((row) => row.balance), 1);

    return result.rows.map((row) => {
      const initialShare = result.breakdown.initialComponent;
      const depositsShare = row.cumulativeDeposits;
      const interestShare = Math.max(0, row.balance - initialShare - depositsShare);
      const scale = BAR_MAX_HEIGHT / maxBalance;

      return {
        year: row.year,
        totalHeight: row.balance * scale,
        initialHeight: initialShare * scale,
        depositsHeight: depositsShare * scale,
        interestHeight: interestShare * scale,
      };
    });
  }, [result]);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Gráfico de evolución del balance por año"
      style={styles.wrapper}
    >
      <ThemedText type="bodyBold">Evolución anual</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.chartRow}>
          {chartData.map((bar) => (
            <View key={bar.year} style={styles.barColumn}>
              <View style={[styles.barTrack, { height: CHART_HEIGHT }]}>
                <View
                  style={[
                    styles.stackedBar,
                    {
                      height: Math.max(bar.totalHeight, 4),
                    },
                  ]}
                >
                  <View
                    style={{
                      height: bar.initialHeight,
                      backgroundColor: theme.deepOcean,
                    }}
                  />
                  <View
                    style={{
                      height: bar.depositsHeight,
                      backgroundColor: theme.primary,
                    }}
                  />
                  <View
                    style={{
                      height: bar.interestHeight,
                      backgroundColor: theme.chartInterest,
                    }}
                  />
                </View>
              </View>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.yearLabel}>
                {bar.year}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.md,
  },
  scrollContent: {
    paddingVertical: Spacing.xs,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    minHeight: CHART_HEIGHT + 24,
  },
  barColumn: {
    width: 36,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  barTrack: {
    justifyContent: 'flex-end',
    width: '100%',
  },
  stackedBar: {
    width: '100%',
    borderTopLeftRadius: Radius.image,
    borderTopRightRadius: Radius.image,
    overflow: 'hidden',
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
  },
  yearLabel: {
    fontSize: 11,
  },
});
