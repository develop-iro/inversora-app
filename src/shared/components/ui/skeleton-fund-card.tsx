import { StyleSheet, View } from 'react-native';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonPanel } from '@/shared/components/ui/skeleton-panel';
import { SkeletonTextBlock } from '@/shared/components/ui/skeleton-text-block';
import { Radius, Spacing } from '@/shared/theme/theme';

/**
 * Fund-card shaped skeleton for compare versus headers.
 */
export function SkeletonFundCard() {
  return (
    <SkeletonPanel style={styles.card}>
      <View style={styles.topRow}>
        <SkeletonBone width={36} height={36} borderRadius={Radius.image} />
        <SkeletonBone width={18} height={18} borderRadius={Radius.full} />
      </View>
      <SkeletonTextBlock
        gap={Spacing.xs}
        lines={[
          { width: '56%', height: 14 },
          { width: '88%', height: 10 },
        ]}
      />
      <SkeletonBone width={52} height={24} borderRadius={Radius.full} />
    </SkeletonPanel>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 118,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
