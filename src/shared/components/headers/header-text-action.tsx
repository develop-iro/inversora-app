import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Spinner } from '@/shared/components/ui/spinner';
import { typographyClassNames } from '@/shared/nativewind/theme-classes';
import { cn } from '@/shared/utils/cn';

export type HeaderTextActionProps = {
  /** Short visible label (e.g. «Omitir»). */
  readonly label: string;
  readonly onPress: () => void;
  readonly accessibilityLabel?: string;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly style?: StyleProp<ViewStyle>;
};

/**
 * Textual toolbar action for use in {@link HeaderBar} trailing slots.
 */
export function HeaderTextAction({
  label,
  onPress,
  accessibilityLabel,
  loading = false,
  disabled = false,
  className,
  style,
}: HeaderTextActionProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={8}
      className={cn(
        'min-h-[44px] min-w-[44px] items-center justify-center px-sm active:opacity-[0.82]',
        isDisabled && 'opacity-50',
        className,
      )}
      style={style}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <Text className={cn(typographyClassNames.button, 'text-deep-ocean')}>{label}</Text>
      )}
    </Pressable>
  );
}
