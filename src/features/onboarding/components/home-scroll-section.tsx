import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { Layout, Spacing } from '@/shared/theme/theme';

export type HomeScrollSectionProps = {
  children: ReactNode;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Visual rhythm wrapper for home scroll blocks with optional soft divider.
 */
export function HomeScrollSection({
  children,
  showDivider = true,
  style,
}: HomeScrollSectionProps) {
  const theme = useTheme();

  return (
    <View style={[styles.wrapper, style]}>
      {showDivider ? (
        <View style={styles.dividerRow} accessibilityElementsHidden importantForAccessibility="no">
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <View style={[styles.dividerGem, { backgroundColor: theme.primary }]} />
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    opacity: 0.85,
  },
  dividerGem: {
    width: 6,
    height: 6,
    borderRadius: 999,
    opacity: 0.45,
  },
  content: {
    gap: Spacing.sm,
  },
});
