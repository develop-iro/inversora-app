import { TextParagraph } from '@/shared/components/text/text-paragraph';

import { InputField, type InputFieldProps } from '@/shared/components/inputs/input-field';

export type InputNumericProps = Omit<InputFieldProps, 'keyboardType' | 'inputMode'> & {
  keyboardType?: 'decimal-pad' | 'number-pad';
  inputMode?: InputFieldProps['inputMode'];
};

/**
 * Decimal or integer numeric field built on {@link InputField}.
 */
export function InputNumeric({
  keyboardType = 'decimal-pad',
  inputMode = keyboardType === 'number-pad' ? 'numeric' : 'decimal',
  suffix,
  ...rest
}: InputNumericProps) {
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
      keyboardType={keyboardType}
      inputMode={inputMode}
      suffix={suffixNode}
      {...rest}
    />
  );
}
