import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CardVariant = 'elevated' | 'outlined' | 'flat';

export type CardProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Card({
  children,
  variant = 'elevated',
  style,
  contentStyle,
  onPress,
  disabled,
  ...pressableProps
}: CardProps) {
  const theme = useTheme();
  const shadows = useThemeShadows();

  const baseStyles = [
    styles.base,
    { backgroundColor: theme.surface },
    variant === 'elevated' && shadows.card,
    variant === 'outlined' && { borderWidth: 1, borderColor: theme.border },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          ...baseStyles,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ]}
        {...pressableProps}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View style={baseStyles}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

export type InvestmentCardProps = Omit<PressableProps, 'children' | 'style'> & {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
};

/** Figma: Investment Small Cards Grid — icon arriba, metadata abajo. */
export function InvestmentCard({
  icon,
  title,
  subtitle,
  style,
  onPress,
  ...pressableProps
}: InvestmentCardProps) {
  return (
    <Card
      variant="elevated"
      onPress={onPress}
      style={[styles.investmentCard, style]}
      contentStyle={styles.investmentContent}
      {...pressableProps}>
      <View style={styles.iconSlot}>{icon}</View>
      <View style={styles.metadata}>
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

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.lg,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
  investmentCard: {
    minHeight: 155,
  },
  investmentContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  iconSlot: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metadata: {
    gap: Spacing.xs,
    alignSelf: 'stretch',
  },
});
