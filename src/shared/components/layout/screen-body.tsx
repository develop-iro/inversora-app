import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Layout, Spacing } from '@/shared/theme/theme';

export type ScreenBodyIntroProps = {
  description?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Introductory copy block that always lives at the top of a screen body.
 */
export function ScreenBodyIntro({ description, children, style }: ScreenBodyIntroProps) {
  return (
    <View style={[styles.intro, style]}>
      {description ? (
        <ThemedText type="caption" themeColor="textSecondary">
          {description}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}

export type ScreenBodyProps = {
  children: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Primary scrollable or flex content region below the header.
 */
export function ScreenBody({ children, padded = true, style }: ScreenBodyProps) {
  return (
    <View style={[styles.body, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    minHeight: 0,
  },
  padded: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  intro: {
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
});
