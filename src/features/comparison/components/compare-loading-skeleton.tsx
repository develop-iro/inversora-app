import { StyleSheet, View } from 'react-native';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonFundCard } from '@/shared/components/ui/skeleton-fund-card';
import { SkeletonPanel } from '@/shared/components/ui/skeleton-panel';
import { SkeletonTextBlock } from '@/shared/components/ui/skeleton-text-block';
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
    <View style={styles.wrapper} accessibilityLabel="Cargando comparación">
      <View style={styles.versusRow}>
        <SkeletonFundCard />
        <SkeletonBone width={28} height={28} borderRadius={Radius.full} />
        <SkeletonFundCard />
      </View>

      <SkeletonPanel>
        <SkeletonBone width="38%" height={14} />
        {Array.from({ length: METRIC_ROW_COUNT }, (_, index) => (
          <SkeletonMetricRow key={`metric-row-${index}`} />
        ))}
      </SkeletonPanel>

      <SkeletonPanel>
        <View style={styles.soraHeader}>
          <SkeletonBone width={24} height={24} borderRadius={Radius.full} />
          <View style={styles.soraCopy}>
            <SkeletonTextBlock
              gap={Spacing.xs}
              lines={[
                { width: '48%', height: 14 },
                { width: '92%', height: 10 },
                { width: '76%', height: 10 },
              ]}
            />
          </View>
        </View>
        <View style={styles.promptRow}>
          <SkeletonBone width="58%" height={32} borderRadius={Radius.full} />
          <SkeletonBone width="72%" height={32} borderRadius={Radius.full} />
        </View>
        <SkeletonBone height={48} borderRadius={Radius.field} />
      </SkeletonPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.md,
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
  soraHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  soraCopy: {
    flex: 1,
  },
  promptRow: {
    gap: Spacing.xs,
  },
});
