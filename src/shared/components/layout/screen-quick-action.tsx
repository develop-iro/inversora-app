import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type ScreenQuickActionProps = {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  variant?: 'surface' | 'accent' | 'deep';
  disabled?: boolean;
};

/**
 * Circular quick action with caption, inspired by mobile banking action grids.
 */
export function ScreenQuickAction({
  icon,
  label,
  accessibilityLabel,
  onPress,
  variant = 'surface',
  disabled = false,
}: ScreenQuickActionProps) {
  const theme = useTheme();

  const circleColors = {
    surface: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      iconColor: theme.deepOcean,
    },
    accent: {
      backgroundColor: 'rgba(0, 191, 166, 0.12)',
      borderColor: 'rgba(0, 191, 166, 0.24)',
      iconColor: theme.deepOcean,
    },
    deep: {
      backgroundColor: theme.deepOcean,
      borderColor: theme.deepOcean,
      iconColor: theme.textOnDark,
    },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.circle,
          {
            backgroundColor: circleColors.backgroundColor,
            borderColor: circleColors.borderColor,
          },
        ]}
      >
        <MaterialCommunityIcons name={icon} size={22} color={circleColors.iconColor} />
      </View>
      <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2} style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 80,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
  },
});
