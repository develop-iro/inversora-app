import { ScrollView, useWindowDimensions, View } from 'react-native';

import type { FundDetail } from '@/core/domain/catalog';
import type { CompareMetricRow } from '@/features/comparison/models/compare-fund-entry';
import { TextParagraph } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

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
  return (
    <View className="flex-row border-b border-border py-sm">
      <View
        className="justify-center px-md"
        // tailwind-exception: fixed column width for table layout
        style={{ width: COMPARE_TABLE_LABEL_WIDTH }}
      />
      {details.map((detail) => {
        const shortLabel =
          detail.fund.symbol.length > 0 ? detail.fund.symbol : detail.fund.isin.slice(-4);

        return (
          <View
            key={detail.fund.isin}
            className="items-center justify-center px-xs"
            style={{ width: COMPARE_TABLE_FUND_COLUMN_WIDTH }}
          >
            <TextParagraph variant="emphasis" numberOfLines={1}>
              {shortLabel}
            </TextParagraph>
          </View>
        );
      })}
    </View>
  );
}

function CompareTableRow({ row }: { row: CompareMetricRow }) {
  const emphasizedIsin = resolveEmphasizedIsin(row);

  return (
    <View className="flex-row items-center border-t border-border py-sm">
      <View
        className="justify-center px-md"
        style={{ width: COMPARE_TABLE_LABEL_WIDTH }}
      >
        <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={2}>
          {row.label}
        </TextParagraph>
      </View>

      {row.values.map((value) => {
        const isEmphasized = emphasizedIsin === value.isin;

        return (
          <View
            key={`${value.isin}-${row.id}`}
            className={cn(
              'items-center justify-center px-xs',
              isEmphasized && '-my-xs rounded-chip bg-soft-teal-background py-xs',
            )}
            style={{ width: COMPARE_TABLE_FUND_COLUMN_WIDTH }}
          >
            {row.id === 'score' ? (
              <TextParagraph
                variant="emphasis"
                themeColor={value.isMissing ? 'textSecondary' : 'text'}
                numberOfLines={2}
              >
                {value.displayValue}
              </TextParagraph>
            ) : (
              <TextParagraph
                variant="secondary"
                themeColor={value.isMissing ? 'textSecondary' : 'text'}
                numberOfLines={2}
              >
                {value.displayValue}
              </TextParagraph>
            )}
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
  const { width: windowWidth } = useWindowDimensions();
  const contentPadding = 32;
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
      className="overflow-hidden rounded-card border border-border bg-surface"
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
