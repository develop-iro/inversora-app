import type { ReactNode } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Shadows, Spacing } from '@/shared/theme/theme';

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

  const baseStyles = [
    styles.base,
    { backgroundColor: theme.surface },
    variant === 'elevated' && Shadows.card,
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
        <ThemedText type="bodyBold" numberOfLines={2}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
    </Card>
  );
}

export type MediaCardProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  subtitle?: string;
  imageSource?: ImageSourcePropType;
  /** Custom media area (e.g. placeholder) when `imageSource` is not set. */
  imageSlot?: ReactNode;
  imageHeight?: number;
  style?: StyleProp<ViewStyle>;
};

/** Figma: Card Rounded Image — imagen con esquinas redondeadas y labels debajo. */
export function MediaCard({
  title,
  subtitle,
  imageSource,
  imageSlot,
  imageHeight = 173,
  style,
  onPress,
  disabled,
  ...pressableProps
}: MediaCardProps) {
  const mediaVisual = imageSlot ?? (
    <Image
      source={imageSource!}
      style={[styles.mediaImage, { height: imageHeight }]}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
    />
  );

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.mediaCard,
        pressed && onPress && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...pressableProps}>
      <View style={[styles.mediaFrame, { height: imageHeight }]}>{mediaVisual}</View>
      <View style={styles.mediaLabels}>
        <ThemedText type="cardTitle" numberOfLines={2}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
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
  mediaCard: {
    width: 232,
    gap: Spacing.sm,
  },
  mediaFrame: {
    width: '100%',
    borderRadius: Radius.image,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaLabels: {
    gap: 2,
    alignSelf: 'stretch',
  },
});
