import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';
import { Radius } from '@/shared/theme/theme';

export type CarouselNavDirection = 'previous' | 'next';

export type CarouselNavButtonProps = {
  direction: CarouselNavDirection;
  accessibilityLabel: string;
  accessibilityHint: string;
  onPress: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: StyleProp<ViewStyle>;
};

const ICON_BY_DIRECTION: Record<CarouselNavDirection, 'chevron-left' | 'chevron-right'> = {
  previous: 'chevron-left',
  next: 'chevron-right',
};

/**
 * Side control for horizontal carousels with themed circular affordance.
 */
export function CarouselNavButton({
  direction,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  onHoverIn,
  onHoverOut,
  onFocus,
  onBlur,
  style,
}: CarouselNavButtonProps) {
  const theme = useTheme();
  const shadows = useThemeShadows();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        shadows.tooltip,
        {
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.accentMint,
        },
        pressed ? styles.buttonPressed : null,
        style,
      ]}
    >
      <MaterialCommunityIcons name={ICON_BY_DIRECTION[direction]} size={24} color={theme.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexShrink: 0,
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
