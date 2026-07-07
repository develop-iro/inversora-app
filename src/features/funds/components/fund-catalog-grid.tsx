import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { CardFund } from '@/features/funds/components/card-fund';
import { Layout, Spacing } from '@/shared/theme/theme';

const TWO_COLUMN_BREAKPOINT = 640;

export type FundCatalogGridProps = {
  funds: CatalogFund[];
  onFundPress: (fund: CatalogFund) => void;
};

export function FundCatalogGrid({ funds, onFundPress }: FundCatalogGridProps) {
  const { width: windowWidth } = useWindowDimensions();

  const cardBasis = useMemo(() => {
    const contentWidth = Math.min(windowWidth, Layout.maxContentWidth);
    const useTwoColumns = contentWidth >= TWO_COLUMN_BREAKPOINT;

    if (!useTwoColumns) {
      return '100%' as const;
    }

    return '48%' as const;
  }, [windowWidth]);

  return (
    <View style={styles.grid} accessibilityRole="list">
      {funds.map((fund) => (
        <CardFund
          key={fund.isin}
          fund={fund}
          style={[styles.card, { flexBasis: cardBasis }]}
          onPress={() => onFundPress(fund)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: Spacing.md,
  },
  card: {
    flexGrow: 1,
    minWidth: 280,
    alignSelf: 'stretch',
  },
});
