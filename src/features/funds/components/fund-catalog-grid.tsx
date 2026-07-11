import { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { CardFund } from '@/features/funds/components/card-fund';
import { Layout } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

const TWO_COLUMN_BREAKPOINT = 640;

export type FundCatalogGridProps = {
  funds: CatalogFund[];
  onFundPress: (fund: CatalogFund) => void;
  className?: string;
};

export function FundCatalogGrid({ funds, onFundPress, className }: FundCatalogGridProps) {
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
    <View className={cn('flex-row flex-wrap items-stretch gap-md', className)} accessibilityRole="list">
      {funds.map((fund) => (
        <CardFund
          key={fund.isin}
          fund={fund}
          className="min-w-[280px] grow self-stretch"
          // tailwind-exception: responsive column width depends on viewport
          style={{ flexBasis: cardBasis }}
          onPress={() => onFundPress(fund)}
        />
      ))}
    </View>
  );
}
