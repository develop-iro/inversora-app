import { StyleSheet } from 'react-native';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonPanel } from '@/shared/components/ui/skeleton-panel';
import { SkeletonTextBlock } from '@/shared/components/ui/skeleton-text-block';
import { Radius, Spacing } from '@/shared/theme/theme';

/**
 * Single catalog row skeleton for the compare fund picker list.
 */
export function SkeletonPickerRow() {
  return (
    <SkeletonPanel style={styles.row}>
      <SkeletonBone width={40} height={40} borderRadius={Radius.image} />
      <SkeletonTextBlock
        gap={Spacing.xs}
        lines={[
          { width: '72%', height: 14 },
          { width: '48%', height: 10 },
        ]}
      />
      <SkeletonBone width={44} height={28} borderRadius={Radius.full} />
    </SkeletonPanel>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
});
