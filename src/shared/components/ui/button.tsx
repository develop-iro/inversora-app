import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing, Typography } from '@/shared/theme/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'onDark';
export type ButtonSize = 'sm' | 'md';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  labelStyle,
  ...pressableProps
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(variant, theme, isDisabled);
  const sizeStyles = size === 'sm' ? styles.sizeSm : styles.sizeMd;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressableProps}>
      {loading ? (
        <ActivityIndicator color={variantStyles.label.color} size="small" />
      ) : (
        <Text style={[styles.label, variantStyles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function getVariantStyles(
  variant: ButtonVariant,
  theme: ReturnType<typeof useTheme>,
  disabled?: boolean,
) {
  const mutedText = disabled ? theme.textSecondary : theme.text;

  switch (variant) {
    case 'onDark':
      return {
        container: { backgroundColor: theme.surface },
        label: { color: theme.text, ...Typography.button },
      };
    case 'secondary':
      return {
        container: { backgroundColor: theme.backgroundSoft },
        label: { color: mutedText, ...Typography.button },
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' },
        label: { color: disabled ? theme.textSecondary : theme.primary, ...Typography.button },
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.border,
        },
        label: { color: mutedText, ...Typography.button },
      };
    case 'primary':
    default:
      return {
        container: { backgroundColor: disabled ? theme.backgroundElement : theme.primary },
        label: { color: theme.textOnPrimary, ...Typography.button },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  sizeSm: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 11,
    minHeight: 40,
  },
  sizeMd: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  label: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
});
