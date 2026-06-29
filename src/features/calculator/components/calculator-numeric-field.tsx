import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CalculatorNumericFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  suffix?: string;
  accessibilityLabel?: string;
  keyboardType?: 'decimal-pad' | 'number-pad';
};

/**
 * Labeled numeric input styled for calculator forms.
 */
export function CalculatorNumericField({
  label,
  value,
  onChangeText,
  suffix,
  accessibilityLabel,
  keyboardType = 'decimal-pad',
}: CalculatorNumericFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          inputMode="decimal"
          style={[styles.input, { color: theme.text }]}
          placeholderTextColor={theme.textSecondary}
        />
        {suffix ? (
          <ThemedText type="bodyBold" themeColor="textSecondary" style={styles.suffix}>
            {suffix}
          </ThemedText>
        ) : null}
      </View>
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
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: Spacing.sm,
  },
  suffix: {
    marginLeft: Spacing.sm,
  },
});
