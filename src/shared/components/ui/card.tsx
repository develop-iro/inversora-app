import type { ReactNode } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { cardVariantClassNames } from '@/shared/nativewind/theme-classes';
import { cn } from '@/shared/utils/cn';

export type CardVariant = 'elevated' | 'outlined' | 'flat';

export type CardProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  contentClassName?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Card({
  children,
  variant = 'elevated',
  className,
  contentClassName,
  style,
  contentStyle,
  onPress,
  disabled,
  ...pressableProps
}: CardProps) {
  const containerClassName = cn(
    'overflow-hidden rounded-card',
    cardVariantClassNames[variant],
    className,
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        className={cn(
          containerClassName,
          'active:opacity-[0.92]',
          disabled && 'opacity-50',
        )}
        style={style}
        {...pressableProps}
      >
        <View className={cn('p-lg', contentClassName)} style={contentStyle}>
          {children}
        </View>
      </Pressable>
    );
  }

  return (
    <View className={containerClassName} style={style}>
      <View className={cn('p-lg', contentClassName)} style={contentStyle}>
        {children}
      </View>
    </View>
  );
}

export type InvestmentCardProps = Omit<PressableProps, 'children' | 'style'> & {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/** Figma: Investment Small Cards Grid — icon arriba, metadata abajo. */
export function InvestmentCard({
  icon,
  title,
  subtitle,
  className,
  style,
  onPress,
  ...pressableProps
}: InvestmentCardProps) {
  return (
    <Card
      variant="elevated"
      onPress={onPress}
      className={cn('min-h-[155px]', className)}
      contentClassName="flex-1 justify-between p-lg"
      style={style}
      {...pressableProps}
    >
      <View className="h-8 w-8 items-center justify-center">{icon}</View>
      <View className="gap-xs self-stretch">
        <TextParagraph variant="emphasis" numberOfLines={2}>
          {title}
        </TextParagraph>
        {subtitle ? (
          <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
            {subtitle}
          </TextParagraph>
        ) : null}
      </View>
    </Card>
  );
}
