import type { ReactNode } from 'react';
import {
  StyleSheet,
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
import { Radius, Spacing, Typography } from '@/shared/theme/theme';

export type InputFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  suffix?: ReactNode;
  message?: string;
  variant?: InputVariant;
  containerStyle?: StyleProp<ViewStyle>;
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
  containerStyle,
  inputStyle,
  accessibilityLabel,
  multiline,
  ...textInputProps
}: InputFieldProps) {
  const theme = useTheme();
  const isError = variant === 'error';
  const resolvedA11yLabel = accessibilityLabel ?? label;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {label}
        </TextParagraph>
      ) : null}

      <View
        style={[
          styles.inputRow,
          multiline && styles.inputRowMultiline,
          {
            backgroundColor: theme.surface,
            borderColor: isError ? theme.warningBannerBorder : theme.border,
          },
        ]}
      >
        <TextInput
          accessibilityLabel={resolvedA11yLabel}
          placeholderTextColor={theme.textSecondary}
          multiline={multiline}
          style={[styles.input, multiline && styles.inputMultiline, { color: theme.text }, inputStyle]}
          {...textInputProps}
        />
        {suffix ? <View style={styles.suffix}>{suffix}</View> : null}
      </View>

      <InputMessage message={message} variant={variant} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
    flex: 1,
    minWidth: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.field,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    minHeight: 96,
    paddingVertical: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    paddingVertical: Spacing.sm,
  },
  inputMultiline: {
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  suffix: {
    marginLeft: Spacing.sm,
    flexShrink: 0,
  },
});
