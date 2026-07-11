import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { cn } from '@/shared/utils/cn';

export type ScreenFooterProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Sticky bottom action region with elevated surface contrast.
 */
export function ScreenFooter({ children, className, style }: ScreenFooterProps) {
  return (
    <View
      className={cn('gap-sm border-t border-border bg-surface px-lg pb-md pt-md', className)}
      style={style}
    >
      {children}
    </View>
  );
}
