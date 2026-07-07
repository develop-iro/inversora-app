import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { HeaderLayout } from '@/shared/components/headers/header-types';
import { useHeaderHorizontalInset } from '@/shared/components/headers/use-header-horizontal-inset';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

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
  style?: StyleProp<ViewStyle>;
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
  style,
  contentStyle,
}: HeaderBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headerHorizontalInset = useHeaderHorizontalInset();
  const isAppLayout = layout === 'app';

  return (
    <View
      accessibilityRole="header"
      style={[
        styles.headerBar,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.borderSubtle,
          paddingTop: safeAreaTop ? insets.top + HEADER_SAFE_TOP_GAP : Spacing.sm,
        },
        style,
      ]}
    >
      <View
        style={[
          isAppLayout ? styles.appRow : styles.navRow,
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
            <View style={styles.appLeading}>{leading}</View>
            <View style={styles.appTrailing}>{trailing}</View>
          </>
        ) : (
          <>
            <View style={styles.navLeading}>{leading}</View>
            <View style={styles.navCenter}>{center}</View>
            <View style={styles.navTrailing}>{trailing}</View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  appLeading: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  appTrailing: {
    flexShrink: 0,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
    minHeight: APP_TOOLBAR_MIN_HEIGHT,
  },
  navLeading: {
    minWidth: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
  },
  navCenter: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTrailing: {
    minWidth: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
});
