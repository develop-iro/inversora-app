import type { ReactNode } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';

import { cn } from '@/shared/utils/cn';

export type SectionCardInsetScrollProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  contentClassName?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Horizontal scroll that aligns its first item with section card inset text.
 */
export function SectionCardInsetScroll({
  children,
  className,
  style,
  contentClassName,
  contentContainerStyle,
}: SectionCardInsetScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn('-mx-lg', className)}
      style={style}
      contentContainerClassName={cn('items-start gap-sm px-lg py-xs', contentClassName)}
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </ScrollView>
  );
}
