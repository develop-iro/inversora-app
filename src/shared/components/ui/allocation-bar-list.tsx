import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import type { AllocationSlice } from '@/core/domain/fund-detail-profile';
import { TextParagraph } from '@/shared/components/text';
import { Divider } from '@/shared/components/ui/divider';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type AllocationBarListProps = {
  slices: AllocationSlice[];
  barColor?: string;
  className?: string;
};

export function AllocationBarList({ slices, barColor, className }: AllocationBarListProps) {
  const theme = useTheme(); // tailwind-exception: icon and optional bar fill colors

  const fillColor = barColor ?? theme.chartAllocationFill;

  return (
    <View className={cn('self-stretch', className)}>
      {slices.map((slice, index) => (
        <View key={`${slice.label}-${index}`}>
          <View className="mb-xs flex-row items-center gap-sm">
            {slice.icon ? (
              <MaterialCommunityIcons
                name={slice.icon as IconName}
                size={20}
                color={theme.primary}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            ) : (
              <View className="w-5" />
            )}
            <TextParagraph variant="default" className="min-w-0 flex-1" numberOfLines={1}>
              {slice.label}
            </TextParagraph>
            <TextParagraph variant="emphasis" className="min-w-[48px] text-right">
              {slice.percent.toFixed(1).replace('.', ',')}%
            </TextParagraph>
          </View>
          <View
            className="mb-sm h-2 overflow-hidden rounded-full bg-surface-muted"
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: slice.percent }}
          >
            <View
              className="h-full rounded-full"
              // tailwind-exception: dynamic fill width and optional custom color
              style={{
                backgroundColor: fillColor,
                width: `${Math.min(100, Math.max(4, slice.percent))}%`,
              }}
            />
          </View>
          {index < slices.length - 1 ? <Divider spacing={8} className="my-0" /> : null}
        </View>
      ))}
    </View>
  );
}
