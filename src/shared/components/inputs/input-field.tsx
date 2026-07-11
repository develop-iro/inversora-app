import type { ReactNode } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { InputMessage } from '@/shared/components/inputs/input-message';
import type { InputVariant } from '@/shared/components/inputs/input-utils';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { useTheme } from '@/shared/hooks/use-theme';
import { typographyClassNames } from '@/shared/nativewind/theme-classes';
import { cn } from '@/shared/utils/cn';

export type InputFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  suffix?: ReactNode;
  message?: string;
  variant?: InputVariant;
  className?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputClassName?: string;
  inputStyle?: TextInputProps['style'];
};

/**
 * Labeled text input with optional suffix and validation message.
 */
export function InputField({
  label,
  suffix,
  message,
  variant = 'default',
  className,
  containerStyle,
  inputClassName,
  inputStyle,
  accessibilityLabel,
  multiline,
  ...textInputProps
}: InputFieldProps) {
  const theme = useTheme(); // tailwind-exception: placeholder, cursor, selection, text input colors
  const isError = variant === 'error';
  const resolvedA11yLabel = accessibilityLabel ?? label;

  return (
    <View className={cn('min-w-0 flex-1 gap-xs', className)} style={containerStyle}>
      {label ? (
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {label}
        </TextParagraph>
      ) : null}

      <View
        className={cn(
          'min-h-[48px] flex-row items-center rounded-field border px-md',
          multiline && 'min-h-[96px] items-start py-sm',
          isError ? 'border-warning-banner-border' : 'border-border',
          'bg-surface',
        )}
      >
        <TextInput
          accessibilityLabel={resolvedA11yLabel}
          placeholderTextColor={theme.textSecondary}
          multiline={multiline}
          className={cn(
            typographyClassNames.body,
            'flex-1 py-sm text-text',
            multiline && 'py-0',
            inputClassName,
          )}
          style={[multiline && { textAlignVertical: 'top' }, inputStyle]}
          cursorColor={theme.primary}
          selectionColor={theme.primary}
          {...textInputProps}
        />
        {suffix ? <View className="ml-sm shrink-0">{suffix}</View> : null}
      </View>

      <InputMessage message={message} variant={variant} />
    </View>
  );
}
