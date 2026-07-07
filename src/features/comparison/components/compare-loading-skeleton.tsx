import { StyleSheet, View } from 'react-native';

import { SectionCard } from '@/shared/components/layout';
import { CardFund } from '@/features/funds/components/card-fund';
import { SkeletonBone, SkeletonPanel, SkeletonShimmerProvider } from '@/shared/components/ui';
import { Radius, Spacing } from '@/shared/theme/theme';

const METRIC_ROW_COUNT = 5;

function SkeletonMetricRow() {
  return (
    <View style={styles.metricRow}>
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
      <View style={styles.wrapper} accessibilityLabel="Cargando comparación">
        <SectionCard title="Fondos seleccionados">
          <View style={styles.versusRow}>
            <CardFund loading layout="compact" />
            <SkeletonBone width={28} height={28} borderRadius={Radius.full} />
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

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.lg,
  },
  versusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
});
