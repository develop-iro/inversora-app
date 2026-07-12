import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { InputMessage } from '@/shared/components/inputs/input-message';
import type { InputVariant } from '@/shared/components/inputs/input-utils';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { useTheme } from '@/shared/hooks/use-theme';
import { typographyClassNames } from '@/shared/nativewind/theme-classes';
import { isWeb } from '@/shared/platform/capabilities';
import { cn } from '@/shared/utils/cn';

const webTextInputStyle: TextStyle | undefined = isWeb
  ? ({
      outlineWidth: 0,
      outlineStyle: 'none',
      borderWidth: 0,
      boxShadow: 'none',
    } as unknown as TextStyle)
  : undefined;

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
  onFocus,
  onBlur,
  ...textInputProps
}: InputFieldProps) {
  const theme = useTheme(); // tailwind-exception: placeholder, cursor, selection, text input colors
  const [isFocused, setIsFocused] = useState(false);
  const isError = variant === 'error';
  const resolvedA11yLabel = accessibilityLabel ?? label;

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    (event) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    (event) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

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
          isError
            ? 'border-warning-banner-border'
            : isFocused
              ? 'border-primary'
              : 'border-border',
          'bg-surface',
        )}
      >
        <TextInput
          accessibilityLabel={resolvedA11yLabel}
          placeholderTextColor={theme.textSecondary}
          multiline={multiline}
          underlineColorAndroid="transparent"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            typographyClassNames.body,
            'm-0 min-w-0 flex-1 p-0 py-sm text-text',
            multiline && 'py-0',
            inputClassName,
          )}
          style={[webTextInputStyle, multiline && { textAlignVertical: 'top' }, inputStyle]}
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
