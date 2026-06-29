import { StyleSheet, View } from 'react-native';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonShimmerProvider } from '@/shared/components/ui/skeleton-shimmer-provider';
import { Layout, Radius, Spacing } from '@/shared/theme/theme';

const CAROUSEL_MIN_HEIGHT = 420;

/**
 * Skeleton placeholder for the featured funds carousel.
 */
export function HomeFeaturedFundsSkeleton() {
  return (
    <SkeletonShimmerProvider durationMs={1600}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <SkeletonBone width={40} height={40} borderRadius={Radius.full} />
            <View style={styles.topText}>
              <SkeletonBone width="72%" height={18} />
              <SkeletonBone width="48%" height={14} />
            </View>
          </View>
          <SkeletonBone width="100%" height={5} borderRadius={Radius.full} />
          <View style={styles.metricsRow}>
            <SkeletonBone width={72} height={36} />
            <SkeletonBone width={88} height={36} />
            <SkeletonBone width={64} height={36} />
          </View>
          <SkeletonBone width="55%" height={14} />
        </View>
        <View style={styles.dots}>
          <SkeletonBone width={22} height={8} borderRadius={Radius.full} />
          <SkeletonBone width={8} height={8} borderRadius={Radius.full} />
          <SkeletonBone width={8} height={8} borderRadius={Radius.full} />
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
  card: {
    minHeight: CAROUSEL_MIN_HEIGHT,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    gap: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  topRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  topText: {
    flex: 1,
    gap: Spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
});
