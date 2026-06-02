import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

export type FundMetricCell = {
  id: string;
  label: string;
  value: string;
  /** Optional secondary value (e.g. +0.5%). */
  hint?: string;
};

export type FundMetricsGridProps = {
  title: string;
  metrics: FundMetricCell[];
};

export function FundMetricsGrid({ title, metrics }: FundMetricsGridProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <ThemedText type="bodyBold" accessibilityRole="header">
        {title}
      </ThemedText>
      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.id} style={styles.cell}>
            <ThemedText type="metaLabel" themeColor="textSecondary">
              {metric.label}
            </ThemedText>
            <View style={styles.valueRow}>
              <ThemedText type="bodyBold">{metric.value}</ThemedText>
              {metric.hint ? (
                <ThemedText type="caption" style={{ color: theme.primary }}>
                  {metric.hint}
                </ThemedText>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.md,
  },
  cell: {
    width: '50%',
    gap: Spacing.xs,
    paddingRight: Spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
});
