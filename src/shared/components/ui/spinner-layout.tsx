import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/shared/theme/theme';

export type SpinnerLayoutProps = {
  readonly children?: ReactNode;
  /** Expands to fill the parent and centers the spinner content. */
  readonly fullscreen?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly accessibilityLabel?: string;
};

/**
 * Layout shell for {@link Spinner}: centers content inline or full-screen.
 */
export function SpinnerLayout({
  children,
  fullscreen = false,
  style,
  accessibilityLabel = 'Cargando',
}: SpinnerLayoutProps) {
  return (
    <View
      style={[fullscreen ? styles.fullscreen : styles.inline, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
});
