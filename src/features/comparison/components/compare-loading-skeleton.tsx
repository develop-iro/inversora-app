import { View } from 'react-native';

import { SectionCard } from '@/shared/components/layout';
import { CardFund } from '@/features/funds/components/card-fund';
import { SkeletonBone, SkeletonPanel, SkeletonShimmerProvider } from '@/shared/components/ui';

const METRIC_ROW_COUNT = 5;

function SkeletonMetricRow() {
  return (
    <View className="flex-row items-center justify-between gap-sm">
      <SkeletonBone width="36%" height={12} />
      <SkeletonBone width="22%" height={12} />
      <SkeletonBone width="22%" height={12} />
    </View>
  );
}

/**
 * Skeleton placeholder for the comparison screen while fund details load.
 */
export function CompareLoadingSkeleton() {
  return (
    <SkeletonShimmerProvider>
      <View className="gap-lg" accessibilityLabel="Cargando comparación">
        <SectionCard title="Fondos seleccionados">
          <View className="flex-row items-center gap-sm">
            <CardFund loading layout="compact" />
            <SkeletonBone width={28} height={28} borderRadius={9999} />
            <CardFund loading layout="compact" />
          </View>
        </SectionCard>

        <SectionCard title="Resultados comparativos" borderless>
          <SkeletonPanel>
            <SkeletonBone width="38%" height={14} />
            {Array.from({ length: METRIC_ROW_COUNT }, (_, index) => (
              <SkeletonMetricRow key={`metric-row-${index}`} />
            ))}
          </SkeletonPanel>
        </SectionCard>
      </View>
    </SkeletonShimmerProvider>
  );
}
