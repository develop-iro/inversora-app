import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius } from '@/shared/theme/theme';

export type ScreenHeaderIconButtonProps = {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  accessibilityLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Circular icon action used in screen headers (close, back, overflow, etc.).
 */
export function ScreenHeaderIconButton({
  icon,
  accessibilityLabel,
  onPress,
  style,
}: ScreenHeaderIconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={theme.deepOcean} />
    </Pressable>
  );
}

export type ScreenHeaderTextActionProps = {
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
  disabled?: boolean;
};

/**
 * Text action aligned to the header trailing edge.
 */
export function ScreenHeaderTextAction({
  label,
  accessibilityLabel,
  onPress,
  disabled = false,
}: ScreenHeaderTextActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.textAction, pressed && !disabled && styles.pressed]}
    >
      <ThemedText type="bodyBold" themeColor={disabled ? 'textSecondary' : 'primary'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAction: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.88,
  },
});
