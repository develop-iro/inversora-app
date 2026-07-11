import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import {
  buttonLabelClassNames,
  buttonVariantClassNames,
} from '@/shared/nativewind/theme-classes';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'onDark';
export type ButtonSize = 'sm' | 'md';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  labelClassName?: string;
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
  className,
  labelClassName,
  style,
  labelStyle,
  onPressIn: externalPressIn,
  onPressOut: externalPressOut,
  onHoverIn: externalHoverIn,
  onHoverOut: externalHoverOut,
  ...pressableProps
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  // tailwind-exception: Animated scale feedback requires transform on Animated.View
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const isHovered = useRef(false);

  const springTo = useCallback(
    (toValue: number, stiffness = 350) => {
      Animated.spring(scaleAnim, {
        toValue,
        damping: 20,
        stiffness,
        useNativeDriver: true,
      }).start();
    },
    [scaleAnim],
  );

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      if (!isDisabled) springTo(0.96, 420);
      externalPressIn?.(e);
    },
    [isDisabled, springTo, externalPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      springTo(isHovered.current ? 1.04 : 1, 300);
      externalPressOut?.(e);
    },
    [springTo, externalPressOut],
  );

  const handleHoverIn = useCallback(
    (e: Parameters<NonNullable<PressableProps['onHoverIn']>>[0]) => {
      isHovered.current = true;
      if (!isDisabled) springTo(1.04, 220);
      externalHoverIn?.(e);
    },
    [isDisabled, springTo, externalHoverIn],
  );

  const handleHoverOut = useCallback(
    (e: Parameters<NonNullable<PressableProps['onHoverOut']>>[0]) => {
      isHovered.current = false;
      springTo(1, 220);
      externalHoverOut?.(e);
    },
    [springTo, externalHoverOut],
  );

  const spinnerColor =
    variant === 'primary' ? theme.textOnPrimary : variant === 'ghost' ? theme.primary : theme.text;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        className={cn(
          'items-center justify-center rounded-pill',
          size === 'sm' ? 'min-h-[40px] px-xl py-[11px]' : 'min-h-[48px] px-xl py-md',
          !(isDisabled && variant === 'primary') && buttonVariantClassNames[variant],
          isDisabled && variant === 'primary' && 'bg-primary-surface-subtle opacity-60',
          isDisabled && variant === 'ghost' && 'opacity-50',
          isDisabled && variant !== 'ghost' && variant !== 'primary' && 'opacity-50',
          fullWidth && 'self-stretch',
          className,
        )}
        style={style}
        {...pressableProps}
      >
        {loading ? (
          <ActivityIndicator color={spinnerColor} size="small" />
        ) : (
          <Text
            className={cn(
              'text-center font-display-bold text-button',
              buttonLabelClassNames[variant],
              isDisabled && variant === 'primary' && 'text-text-secondary opacity-80',
              isDisabled && variant === 'ghost' && 'text-text-secondary',
              isDisabled && variant !== 'ghost' && variant !== 'primary' && 'text-text-secondary',
              labelClassName,
            )}
            style={labelStyle}
            numberOfLines={1}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
