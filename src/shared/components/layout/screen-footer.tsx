import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { Layout, Spacing } from '@/shared/theme/theme';

export type ScreenFooterProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Sticky bottom action region with elevated surface contrast.
 */
export function ScreenFooter({ children, style }: ScreenFooterProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: theme.surface,
          borderTopColor: 'rgba(11, 46, 54, 0.08)',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
});
