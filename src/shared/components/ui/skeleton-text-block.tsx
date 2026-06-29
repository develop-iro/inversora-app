import { StyleSheet, View } from 'react-native';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { Spacing } from '@/shared/theme/theme';

export type SkeletonTextLine = {
  width: number | `${number}%`;
  height?: number;
};

export type SkeletonTextBlockProps = {
  lines: readonly SkeletonTextLine[];
  gap?: number;
};

/**
 * Stacked pill bars with varied widths to mimic loading copy.
 */
export function SkeletonTextBlock({ lines, gap = Spacing.sm }: SkeletonTextBlockProps) {
  return (
    <View style={[styles.block, { gap }]}>
      {lines.map((line, index) => (
        <SkeletonBone
          key={`${String(line.width)}-${index}`}
          width={line.width}
          height={line.height ?? 12}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignSelf: 'stretch',
  },
});
