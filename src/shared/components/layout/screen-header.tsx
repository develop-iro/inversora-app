import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Layout, Spacing } from '@/shared/theme/theme';

export type ScreenHeaderProps = {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Standalone screen header with title and configurable action slots.
 * Descriptive copy belongs in `ScreenBodyIntro`, not here.
 */
export function ScreenHeader({ title, leading, trailing, style }: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="header"
      style={[
        styles.header,
        {
          backgroundColor: theme.surface,
          borderBottomColor: 'rgba(11, 46, 54, 0.08)',
        },
        style,
      ]}
    >
      {leading !== undefined ? <View style={styles.leadingSlot}>{leading}</View> : null}

      <View style={styles.titleSlot}>
        <ThemedText type="sectionTitle" themeColor="deepOcean" numberOfLines={1}>
          {title}
        </ThemedText>
      </View>

      {trailing !== undefined ? <View style={styles.trailingSlot}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  leadingSlot: {
    flexShrink: 0,
  },
  trailingSlot: {
    flexShrink: 0,
  },
  titleSlot: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
});
