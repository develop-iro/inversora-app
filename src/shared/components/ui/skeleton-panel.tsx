import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { skeletonTokens } from '@/shared/components/ui/skeleton-tokens';
import { Radius, Shadows, Spacing } from '@/shared/theme/theme';

export type SkeletonPanelProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

/**
 * Elevated white surface that groups skeleton lines (BBVA-style content card).
 */
export function SkeletonPanel({ children, style, padded = true }: SkeletonPanelProps) {
  return (
    <View
      style={[
        styles.panel,
        padded && styles.padded,
        {
          backgroundColor: skeletonTokens.panelBackground,
          borderColor: skeletonTokens.panelBorder,
        },
        Shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  padded: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});
