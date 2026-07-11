import { View } from 'react-native';

import type { ScoreBreakdown } from '@/core/scoring/types';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

export type FundScoreBreakdownProps = {
  breakdown: ScoreBreakdown;
  className?: string;
};

export function FundScoreBreakdown({ breakdown, className }: FundScoreBreakdownProps) {
  return (
    <View className={cn('gap-md', className)}>
      {breakdown.map((criterion) => (
        <View key={criterion.id} className="flex-row items-end gap-md">
          <View className="flex-1 gap-xs">
            <TextParagraph variant="secondary" themeColor="textSecondary">
              {criterion.label}
            </TextParagraph>
            <View
              className="h-[6px] overflow-hidden rounded-full bg-surface-muted"
              accessibilityRole="progressbar"
              accessibilityValue={{
                min: 0,
                max: criterion.maxPoints,
                now: criterion.points,
              }}
            >
              <View
                className="h-full rounded-full bg-primary"
                // tailwind-exception: progress bar width is data-driven
                style={{
                  width: `${Math.max(8, (criterion.points / Math.max(criterion.maxPoints, 1)) * 100)}%`,
                }}
              />
            </View>
          </View>
          <TextLabel variant="meta" themeColor="deepOcean">
            {criterion.points}/{criterion.maxPoints}
          </TextLabel>
        </View>
      ))}
    </View>
  );
}
