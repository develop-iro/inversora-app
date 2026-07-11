import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/shared/utils/cn';

export type ScreenShellProps = {
  header: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  overlay?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Canonical page structure: header, body, optional footer, optional overlay layer.
 */
export function ScreenShell({ header, body, footer, overlay, className, style }: ScreenShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn('flex-1 bg-background', className)}
      // tailwind-exception: safe-area bottom inset is runtime-only
      style={[
        { paddingBottom: footer === undefined ? insets.bottom : 0 },
        style,
      ]}
    >
      {header}
      {body}
      {footer !== undefined ? (
        <View style={{ paddingBottom: insets.bottom }}>{footer}</View>
      ) : null}
      {overlay !== undefined ? (
        <View className="absolute inset-0" pointerEvents="box-none">
          {overlay}
        </View>
      ) : null}
    </View>
  );
}
