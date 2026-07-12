import { useCallback, useEffect, useState } from 'react';

import { InputField, type InputFieldProps } from '@/shared/components/inputs/input-field';
import { sanitizeLocalizedDecimalInput } from '@/shared/components/inputs/input-utils';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { isWeb } from '@/shared/platform/capabilities';

export type InputNumericProps = Omit<InputFieldProps, 'keyboardType' | 'inputMode'> & {
  keyboardType?: 'decimal-pad' | 'number-pad';
  inputMode?: InputFieldProps['inputMode'];
};

/**
 * Decimal or integer numeric field built on {@link InputField}.
 * Keeps a local draft while focused so locale formatting does not fight typing.
 */
export function InputNumeric({
  keyboardType = 'decimal-pad',
  inputMode = keyboardType === 'number-pad' ? 'numeric' : 'decimal',
  suffix,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...rest
}: InputNumericProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [draftValue, setDraftValue] = useState(value ?? '');

  useEffect(() => {
    if (!isFocused) {
      setDraftValue(value ?? '');
    }
  }, [isFocused, value]);

  const handleChangeText = useCallback(
    (text: string) => {
      const sanitized =
        keyboardType === 'number-pad'
          ? text.replace(/\D/g, '')
          : sanitizeLocalizedDecimalInput(text);

      setDraftValue(sanitized);
      onChangeText?.(sanitized);
    },
    [keyboardType, onChangeText],
  );

  const handleFocus = useCallback<NonNullable<InputFieldProps['onFocus']>>(
    (event) => {
      setIsFocused(true);
      setDraftValue(value ?? '');
      onFocus?.(event);
    },
    [onFocus, value],
  );

  const handleBlur = useCallback<NonNullable<InputFieldProps['onBlur']>>(
    (event) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  const suffixNode =
    typeof suffix === 'string' ? (
      <TextParagraph variant="emphasis" themeColor="textSecondary">
        {suffix}
      </TextParagraph>
    ) : (
      suffix
    );

  return (
    <InputField
      keyboardType={isWeb ? 'default' : keyboardType}
      inputMode={inputMode}
      suffix={suffixNode}
      value={isFocused ? draftValue : (value ?? '')}
      onChangeText={handleChangeText}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    />
  );
}
