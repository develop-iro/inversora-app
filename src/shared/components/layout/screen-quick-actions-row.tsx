import { Children, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { cn } from '@/shared/utils/cn';

export type ScreenQuickActionsRowProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Evenly spaced row for {@link ScreenQuickAction} items with consistent wrapping.
 */
export function ScreenQuickActionsRow({ children, className, style }: ScreenQuickActionsRowProps) {
  return (
    <View className={cn('flex-row flex-wrap gap-md', className)} style={style}>
      {Children.map(children, (child, index) =>
        child !== null && child !== undefined ? (
          <View key={index} className="max-w-[48%] min-w-[96px] flex-grow basis-[42%] items-center">
            {child}
          </View>
        ) : null,
      )}
    </View>
  );
}
