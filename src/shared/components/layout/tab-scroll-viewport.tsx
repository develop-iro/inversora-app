import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTabScrollViewportStyle } from '@/shared/hooks/use-tab-scroll-viewport-style';
import { cn } from '@/shared/utils/cn';

export type TabScrollViewportProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Bounds tab screen scroll areas to the viewport on web.
 * Wrap a flex `ScrollView` child so vertical scroll works inside React Navigation tab scenes.
 */
export function TabScrollViewport({ children, className, style }: TabScrollViewportProps) {
  const scrollViewportStyle = useTabScrollViewportStyle();

  return (
    <View
      className={cn('min-h-0 flex-1 bg-background', className)}
      // tailwind-exception: explicit web height keeps scroll inside the tab viewport
      style={[scrollViewportStyle, style]}
    >
      {children}
    </View>
  );
}
