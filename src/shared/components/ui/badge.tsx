import type { ReactNode } from 'react';
import { Pressable, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import {
  badgeLabelClassNames,
  badgeVariantClassNames,
} from '@/shared/nativewind/theme-classes';
import { cn } from '@/shared/utils/cn';

export type BadgeVariant = 'soft' | 'muted' | 'warning' | 'danger' | 'mint';

export type BadgeProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Badge({
  label,
  variant = 'soft',
  icon,
  className,
  style,
  disabled,
  onPress,
  ...pressableProps
}: BadgeProps) {
  const containerClassName = cn(
    'min-h-[28px] flex-row items-center gap-xs self-start rounded-chip px-md py-smPlus',
    badgeVariantClassNames[variant],
    disabled && 'opacity-50',
    className,
  );

  const content = (
    <>
      <Text
        className={cn('font-display-bold text-metaLabel uppercase', badgeLabelClassNames[variant])}
        numberOfLines={1}
      >
        {label}
      </Text>
      {icon ? <View className="h-4 w-4 items-center justify-center">{icon}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        className={cn(containerClassName, 'active:opacity-[0.88]')}
        style={style}
        {...pressableProps}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View accessibilityRole="text" className={containerClassName} style={style}>
      {content}
    </View>
  );
}
