import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { getSkeletonTokens } from '@/shared/components/ui/skeleton-tokens';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type SkeletonPanelProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

/**
 * Elevated white surface that groups skeleton lines (BBVA-style content card).
 */
export function SkeletonPanel({ children, className, style, padded = true }: SkeletonPanelProps) {
  const theme = useTheme(); // tailwind-exception: skeleton panel border uses theme token
  const skeletonTokens = getSkeletonTokens(theme);

  return (
    <View
      className={cn(
        'overflow-hidden rounded-card border bg-surface shadow-card',
        padded && 'gap-md p-lg',
        className,
      )}
      // tailwind-exception: skeleton panel border color from theme tokens
      style={[{ borderColor: skeletonTokens.panelBorder }, style]}
    >
      {children}
    </View>
  );
}
