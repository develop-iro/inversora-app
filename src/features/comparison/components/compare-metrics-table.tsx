import type { CatalogFund } from '@/core/domain/catalog';
import { getFundScore } from '@/features/funds/utils/fund-summary';
import { ThemedText } from '@/shared/components/themed-text';
import { ScorePill } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';
import { StyleSheet, View } from 'react-native';

export type CompareMetricsTableProps = {
  funds: readonly CatalogFund[];
};

type MetricRow = {
  label: string;
  values: readonly string[];
};

function formatTer(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} %`;
}

function buildRows(funds: readonly CatalogFund[]): MetricRow[] {
  return [
    {
      label: 'Score Inversora',
      values: funds.map((fund) => String(getFundScore(fund))),
    },
    {
      label: 'TER',
      values: funds.map((fund) => formatTer(fund.terPercent)),
    },
    {
      label: 'Categoría',
      values: funds.map((fund) => fund.categoryLabel),
    },
    {
      label: 'Riesgo',
      values: funds.map((fund) => fund.riskLevel),
    },
    {
      label: 'ISIN',
      values: funds.map((fund) => fund.isin),
    },
  ];
}

export function CompareMetricsTable({ funds }: CompareMetricsTableProps) {
  const theme = useTheme();

  if (funds.length === 0) {
    return null;
  }

  const rows = buildRows(funds);

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel="Tabla comparativa educativa de fondos"
      style={[styles.table, { borderColor: theme.border, backgroundColor: theme.surface }]}
    >
      <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
        <View style={styles.metricLabelCell}>
          <ThemedText type="metaLabel" themeColor="textSecondary">
            Métrica
          </ThemedText>
        </View>
        {funds.map((fund) => (
          <View key={fund.isin} style={styles.valueCell}>
            <ThemedText type="caption" numberOfLines={2}>
              {fund.name}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.metricLabelCell}>
          <ThemedText type="caption" themeColor="textSecondary">
            Score
          </ThemedText>
        </View>
        {funds.map((fund) => (
          <View key={`${fund.isin}-score`} style={styles.valueCell}>
            <ScorePill score={getFundScore(fund)} />
          </View>
        ))}
      </View>

      {rows.slice(1).map((row) => (
        <View key={row.label} style={[styles.dataRow, { borderTopColor: theme.border }]}>
          <View style={styles.metricLabelCell}>
            <ThemedText type="caption" themeColor="textSecondary">
              {row.label}
            </ThemedText>
          </View>
          {row.values.map((value, index) => (
            <View key={`${funds[index]?.isin ?? index}-${row.label}`} style={styles.valueCell}>
              <ThemedText type="caption">{value}</ThemedText>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.sm,
  },
  metricLabelCell: {
    width: 88,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
  },
  valueCell: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
});
