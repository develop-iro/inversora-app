import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { HeaderLayout } from '@/shared/components/headers/header-types';
import { useHeaderHorizontalInset } from '@/shared/components/headers/use-header-horizontal-inset';
import { Spacing } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

const HEADER_SAFE_TOP_GAP = Spacing.xs;
const HEADER_ACTION_ICON_SIZE = 34;
const HEADER_CAPTION_GAP = 3;
const HEADER_CAPTION_LINE_HEIGHT = 12;
const APP_TOOLBAR_MIN_HEIGHT =
  HEADER_ACTION_ICON_SIZE + HEADER_CAPTION_GAP + HEADER_CAPTION_LINE_HEIGHT;

export type HeaderBarProps = {
  layout?: HeaderLayout;
  leading?: ReactNode;
  center?: ReactNode;
  trailing?: ReactNode;
  safeAreaTop?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  contentClassName?: string;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Low-level header shell shared by app, screen, and modal presets.
 */
export function HeaderBar({
  layout = 'screen',
  leading,
  center,
  trailing,
  safeAreaTop = true,
  className,
  style,
  contentClassName,
  contentStyle,
}: HeaderBarProps) {
  const insets = useSafeAreaInsets();
  const headerHorizontalInset = useHeaderHorizontalInset();
  const isAppLayout = layout === 'app';

  return (
    <View
      accessibilityRole="header"
      className={cn('w-full border-b border-border-subtle bg-background', className)}
      // tailwind-exception: safe-area top inset is runtime-only
      style={[
        {
          paddingTop: safeAreaTop ? insets.top + HEADER_SAFE_TOP_GAP : Spacing.sm,
        },
        style,
      ]}
    >
      <View
        className={cn(
          isAppLayout
            ? 'flex-row items-center justify-between gap-md py-sm'
            : 'min-h-[44px] flex-row items-stretch justify-between gap-md py-sm',
          contentClassName,
        )}
        style={[
          {
            paddingHorizontal: headerHorizontalInset,
            width: '100%',
            minHeight: APP_TOOLBAR_MIN_HEIGHT,
          },
          contentStyle,
        ]}
      >
        {isAppLayout ? (
          <>
            <View className="min-w-0 flex-1 shrink">{leading}</View>
            <View className="shrink-0">{trailing}</View>
          </>
        ) : (
          <>
            <View className="min-w-[88px] shrink-0 flex-row items-center justify-start">{leading}</View>
            <View className="min-w-0 flex-1 items-center justify-center">{center}</View>
            <View className="min-w-[88px] shrink-0 flex-row items-center justify-end">{trailing}</View>
          </>
        )}
      </View>
    </View>
  );
}
