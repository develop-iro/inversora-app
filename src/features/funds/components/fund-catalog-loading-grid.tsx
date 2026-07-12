import { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { CardFund } from '@/features/funds/components/card-fund';
import { Layout } from '@/shared/theme/theme';
import { SkeletonShimmerProvider } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const TWO_COLUMN_BREAKPOINT = 640;
const SKELETON_CARD_COUNT = 6;

export type FundCatalogLoadingGridProps = {
  className?: string;
};

/**
 * Skeleton placeholder grid for the catalog while funds load or refresh.
 */
export function FundCatalogLoadingGrid({ className }: FundCatalogLoadingGridProps) {
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
    <SkeletonShimmerProvider>
      <View
        className={cn('flex-row flex-wrap items-stretch gap-md', className)}
        accessibilityLabel="Cargando catálogo de fondos"
      >
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <CardFund
            key={`catalog-skeleton-${index}`}
            loading
            className="min-w-[280px] grow self-stretch"
            // tailwind-exception: responsive column width depends on viewport
            style={{ flexBasis: cardBasis }}
          />
        ))}
      </View>
    </SkeletonShimmerProvider>
  );
}
