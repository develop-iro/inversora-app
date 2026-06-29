import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import type { FundDetail } from '@/core/domain/catalog';
import type { CompareMetricRow } from '@/features/comparison/models/compare-fund-entry';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { palette } from '@/shared/theme/palette';
import { Radius, Spacing } from '@/shared/theme/theme';

export const COMPARE_TABLE_LABEL_WIDTH = 112;
export const COMPARE_TABLE_FUND_COLUMN_WIDTH = 76;

export type CompareMetricsTableProps = {
  details: readonly FundDetail[];
  rows: readonly CompareMetricRow[];
};

function resolveEmphasizedIsin(row: CompareMetricRow): string | null {
  if (!row.emphasizeLower) {
    return null;
  }

  const numericValues = row.values.filter(
    (value) => !value.isMissing && value.numericValue !== undefined,
  );

  if (numericValues.length < 2) {
    return null;
  }

  const best = numericValues.reduce((currentBest, value) =>
    (value.numericValue ?? Number.POSITIVE_INFINITY) <
    (currentBest.numericValue ?? Number.POSITIVE_INFINITY)
      ? value
      : currentBest,
  );

  return best.isin;
}

function CompareTableHeader({ details }: { details: readonly FundDetail[] }) {
  const theme = useTheme();

  return (
    <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
      <View style={[styles.labelCell, { width: COMPARE_TABLE_LABEL_WIDTH }]} />
      {details.map((detail) => {
        const shortLabel =
          detail.fund.symbol.length > 0 ? detail.fund.symbol : detail.fund.isin.slice(-4);

        return (
          <View
            key={detail.fund.isin}
            style={[styles.fundCell, { width: COMPARE_TABLE_FUND_COLUMN_WIDTH }]}
          >
            <ThemedText type="bodyBold" numberOfLines={1}>
              {shortLabel}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

function CompareTableRow({ row }: { row: CompareMetricRow }) {
  const theme = useTheme();
  const emphasizedIsin = resolveEmphasizedIsin(row);

  return (
    <View style={[styles.dataRow, { borderTopColor: theme.border }]}>
      <View style={[styles.labelCell, { width: COMPARE_TABLE_LABEL_WIDTH }]}>
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
          {row.label}
        </ThemedText>
      </View>

      {row.values.map((value) => {
        const isEmphasized = emphasizedIsin === value.isin;

        return (
          <View
            key={`${value.isin}-${row.id}`}
            style={[
              styles.fundCell,
              { width: COMPARE_TABLE_FUND_COLUMN_WIDTH },
              isEmphasized && styles.emphasizedCell,
            ]}
          >
            <ThemedText
              type={row.id === 'score' ? 'bodyBold' : 'caption'}
              themeColor={value.isMissing ? 'textSecondary' : 'text'}
              numberOfLines={2}
            >
              {value.displayValue}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Compact side-by-side metrics table inside a single card.
 */
export function CompareMetricsTable({ details, rows }: CompareMetricsTableProps) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const contentPadding = Spacing.lg * 2;
  const tableMinWidth =
    COMPARE_TABLE_LABEL_WIDTH + details.length * COMPARE_TABLE_FUND_COLUMN_WIDTH;
  const needsHorizontalScroll = tableMinWidth + contentPadding > windowWidth;

  if (details.length === 0 || rows.length === 0) {
    return null;
  }

  const tableBody = (
    <View style={{ minWidth: tableMinWidth }}>
      <CompareTableHeader details={details} />
      {rows.map((row) => (
        <CompareTableRow key={row.id} row={row} />
      ))}
    </View>
  );

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel="Tabla comparativa educativa de fondos"
      style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surface }]}
    >
      {needsHorizontalScroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tableBody}
        </ScrollView>
      ) : (
        tableBody
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  labelCell: {
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  fundCell: {
    paddingHorizontal: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emphasizedCell: {
    backgroundColor: palette.softTealBackground,
    borderRadius: Radius.chip,
    marginVertical: -Spacing.xs,
    paddingVertical: Spacing.xs,
  },
});
