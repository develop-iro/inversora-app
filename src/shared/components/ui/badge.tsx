import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing, Typography } from '@/shared/theme/theme';

export type BadgeVariant = 'soft' | 'muted' | 'warning' | 'danger' | 'mint';

export type BadgeProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: BadgeVariant;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Badge({
  label,
  variant = 'soft',
  icon,
  style,
  disabled,
  onPress,
  ...pressableProps
}: BadgeProps) {
  const theme = useTheme();
  const containerStyle = getVariantContainer(variant, theme);

  const content = (
    <>
      <Text style={[styles.label, { color: theme.text }]} numberOfLines={1}>
        {label}
      </Text>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          containerStyle,
          pressed && styles.pressed,
          disabled && styles.disabled,
          style,
        ]}
        {...pressableProps}>
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityRole="text"
      style={[styles.base, containerStyle, disabled && styles.disabled, style]}>
      {content}
    </View>
  );
}

function getVariantContainer(variant: BadgeVariant, theme: ReturnType<typeof useTheme>) {
  switch (variant) {
    case 'muted':
      return { backgroundColor: theme.surfaceMuted };
    case 'warning':
      return { backgroundColor: theme.warning };
    case 'danger':
      return { backgroundColor: theme.danger };
    case 'mint':
      return { backgroundColor: theme.accentMint };
    case 'soft':
    default:
      return { backgroundColor: theme.backgroundSoft };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    minHeight: 28,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.chip,
  },
  label: {
    ...Typography.chip,
  },
  icon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
});
