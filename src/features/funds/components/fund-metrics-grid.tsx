import { StyleSheet, View } from 'react-native';

import { HeaderSection } from '@/shared/components/headers/header-section';
import { TextLabel, TextParagraph } from '@/shared/components/text';
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
  if (metrics.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <HeaderSection title={title} variant="compact" style={styles.header} />
      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.id} style={styles.cell}>
            <TextLabel variant="meta" themeColor="textSecondary">
              {metric.label}
            </TextLabel>
            <View style={styles.valueRow}>
              <TextParagraph variant="emphasis">{metric.value}</TextParagraph>
              {metric.hint ? (
                <TextParagraph variant="secondary" themeColor="primary">
                  {metric.hint}
                </TextParagraph>
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
    gap: Spacing.sm,
    alignSelf: 'stretch',
  },
  header: {
    paddingBottom: 0,
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
