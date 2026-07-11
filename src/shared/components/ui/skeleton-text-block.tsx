import { View } from 'react-native';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { cn } from '@/shared/utils/cn';

export type SkeletonTextLine = {
  width: number | `${number}%`;
  height?: number;
};

export type SkeletonTextBlockProps = {
  lines: readonly SkeletonTextLine[];
  gap?: number;
  className?: string;
};

/**
 * Stacked pill bars with varied widths to mimic loading copy.
 */
export function SkeletonTextBlock({ lines, gap, className }: SkeletonTextBlockProps) {
  return (
    <View className={cn('self-stretch', gap === undefined ? 'gap-sm' : undefined, className)} style={gap !== undefined ? { gap } : undefined}>
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
