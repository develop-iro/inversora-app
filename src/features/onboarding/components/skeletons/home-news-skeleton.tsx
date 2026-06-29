import { StyleSheet, View } from 'react-native';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonShimmerProvider } from '@/shared/components/ui/skeleton-shimmer-provider';
import { Layout, Radius, Spacing } from '@/shared/theme/theme';

/**
 * Skeleton placeholder for home investment news cards.
 */
export function HomeNewsSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <SkeletonShimmerProvider durationMs={1700}>
      <View style={styles.wrapper}>
        {Array.from({ length: cards }, (_, index) => (
          <View key={`news-skeleton-${index}`} style={styles.card}>
            <View style={styles.metaRow}>
              <SkeletonBone width={72} height={22} borderRadius={Radius.full} />
              <SkeletonBone width={56} height={12} />
            </View>
            <SkeletonBone width="88%" height={18} />
            <SkeletonBone width="100%" height={12} />
            <SkeletonBone width="92%" height={12} />
            <SkeletonBone width="34%" height={12} />
          </View>
        ))}
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
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
