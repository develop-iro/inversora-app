import { StyleSheet, View } from 'react-native';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonShimmerProvider } from '@/shared/components/ui/skeleton-shimmer-provider';
import { Layout, Radius, Spacing } from '@/shared/theme/theme';

/**
 * Skeleton placeholder for home ranking rows.
 */
export function HomeRankingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <SkeletonShimmerProvider durationMs={1500}>
      <View style={styles.wrapper}>
        <SkeletonBone width="42%" height={22} borderRadius={Radius.chip} />
        <SkeletonBone width="78%" height={14} />

        <View style={styles.list}>
          {Array.from({ length: rows }, (_, index) => (
            <View key={`rank-skeleton-${index}`} style={styles.row}>
              <SkeletonBone width={36} height={36} borderRadius={Radius.chip} />
              <View style={styles.rowBody}>
                <SkeletonBone width="68%" height={16} />
                <SkeletonBone width="46%" height={12} />
              </View>
              <SkeletonBone width={44} height={28} borderRadius={Radius.full} />
            </View>
          ))}
        </View>
      </View>
    </SkeletonShimmerProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.md,
  },
  list: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  rowBody: {
    flex: 1,
    gap: Spacing.sm,
  },
});
