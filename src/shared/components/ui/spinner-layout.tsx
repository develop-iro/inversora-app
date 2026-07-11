import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { cn } from '@/shared/utils/cn';

export type SpinnerLayoutProps = {
  readonly children?: ReactNode;
  /** Expands to fill the parent and centers the spinner content. */
  readonly fullscreen?: boolean;
  readonly className?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly accessibilityLabel?: string;
};

/**
 * Layout shell for {@link Spinner}: centers content inline or full-screen.
 */
export function SpinnerLayout({
  children,
  fullscreen = false,
  className,
  style,
  accessibilityLabel = 'Cargando',
}: SpinnerLayoutProps) {
  return (
    <View
      className={cn(
        'items-center justify-center',
        fullscreen ? 'flex-1 py-xl' : 'py-md',
        className,
      )}
      style={style}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}
