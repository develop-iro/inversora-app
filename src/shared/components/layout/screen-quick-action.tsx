import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type ScreenQuickActionProps = {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  variant?: 'surface' | 'accent' | 'deep';
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const circleVariantClassNames = {
  surface: 'border-border bg-surface',
  accent: 'border-primary-border bg-primary-surface',
  deep: 'border-deep-ocean bg-deep-ocean',
} as const;

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
  className,
  style,
}: ScreenQuickActionProps) {
  const theme = useTheme(); // tailwind-exception: icon colors per variant

  const iconColor = {
    surface: theme.deepOcean,
    accent: theme.deepOcean,
    deep: theme.textOnDark,
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'w-20 items-center gap-sm',
        disabled && 'opacity-45',
        className,
      )}
      style={({ pressed }) => [style, pressed && !disabled && { opacity: 0.88 }]}
    >
      <View
        className={cn(
          'h-14 w-14 items-center justify-center rounded-full border',
          circleVariantClassNames[variant],
        )}
      >
        <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
      </View>
      <TextParagraph
        variant="secondary"
        themeColor="textSecondary"
        numberOfLines={2}
        className="text-center leading-4"
      >
        {label}
      </TextParagraph>
    </Pressable>
  );
}
