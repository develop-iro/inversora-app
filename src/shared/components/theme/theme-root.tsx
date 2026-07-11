import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/shared/utils/cn';

export type ThemeRootProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Root layout wrapper for NativeWind semantic tokens.
 * MVP uses the light palette only; dark CSS variables stay unused until a future pass.
 */
export function ThemeRoot({ children, className }: ThemeRootProps) {
  return <View className={cn('flex-1', className)}>{children}</View>;
}
