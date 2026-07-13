import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type CarouselNavDirection = 'previous' | 'next';

export type CarouselNavButtonProps = {
  direction: CarouselNavDirection;
  accessibilityLabel: string;
  accessibilityHint: string;
  onPress: () => void;
  disabled?: boolean;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
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
  disabled = false,
  onHoverIn,
  onHoverOut,
  onFocus,
  onBlur,
  className,
  style,
}: CarouselNavButtonProps) {
  const theme = useTheme(); // tailwind-exception: icon color

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      className={cn(
        'h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-accent-mint bg-background-soft shadow-tooltip active:scale-[0.96] active:opacity-85',
        disabled ? 'opacity-75 active:scale-100 active:opacity-75' : null,
        className,
      )}
      style={style}
    >
      <MaterialCommunityIcons name={ICON_BY_DIRECTION[direction]} size={24} color={theme.primary} />
    </Pressable>
  );
}
