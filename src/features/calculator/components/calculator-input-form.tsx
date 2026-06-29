import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CalculatorNumericField } from '@/features/calculator/components/calculator-numeric-field';
import {
  formatCalculatorInputNumber,
  parseCalculatorNumber,
  type CompoundInterestInput,
  type DepositFrequency,
  type DepositTiming,
} from '@/features/calculator/models/compound-interest.engine';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CalculatorInputFormProps = {
  input: CompoundInterestInput;
  onChange: (patch: Partial<CompoundInterestInput>) => void;
  onCalculate: () => void;
  onReset: () => void;
  rateHint?: string;
};

type ChipOption<T extends string> = {
  value: T;
  label: string;
};

const FREQUENCY_OPTIONS: ChipOption<DepositFrequency>[] = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
];

const TIMING_OPTIONS: ChipOption<DepositTiming>[] = [
  { value: 'start', label: 'Al inicio del periodo' },
  { value: 'end', label: 'Al final del periodo' },
];

function OptionChip<T extends string>({
  option,
  selected,
  onPress,
}: {
  option: ChipOption<T>;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.backgroundSoft : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}
    >
      <ThemedText type="caption" style={{ color: selected ? theme.deepOcean : theme.text }}>
        {option.label}
      </ThemedText>
    </Pressable>
  );
}

/**
 * Calculator parameter form with educational defaults.
 */
export function CalculatorInputForm({
  input,
  onChange,
  onCalculate,
  onReset,
  rateHint,
}: CalculatorInputFormProps) {
  const theme = useTheme();
  const fieldValues = useMemo(
    () => ({
      initialBalance: formatCalculatorInputNumber(input.initialBalance),
      periodicDeposit: formatCalculatorInputNumber(input.periodicDeposit),
      annualRatePercent: formatCalculatorInputNumber(input.annualRatePercent),
      durationYears: String(Math.round(input.durationYears)),
    }),
    [input],
  );

  return (
    <Card variant="outlined" style={styles.card}>
      <ThemedText type="bodyBold">¿Cuánto puedo ahorrar?</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        Introduce cantidades en euros. El resultado es una simulación educativa, no una previsión
        garantizada.
      </ThemedText>

      <View style={styles.row}>
        <CalculatorNumericField
          label="Balance inicial"
          value={fieldValues.initialBalance}
          suffix="€"
          onChangeText={(text) => onChange({ initialBalance: parseCalculatorNumber(text) })}
        />
        <CalculatorNumericField
          label="Aportación periódica"
          value={fieldValues.periodicDeposit}
          suffix="€"
          onChangeText={(text) => onChange({ periodicDeposit: parseCalculatorNumber(text) })}
        />
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="caption" themeColor="textSecondary">
          Frecuencia de aportación
        </ThemedText>
        <View style={styles.chipRow}>
          {FREQUENCY_OPTIONS.map((option) => (
            <OptionChip
              key={option.value}
              option={option}
              selected={input.depositFrequency === option.value}
              onPress={() => onChange({ depositFrequency: option.value })}
            />
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="caption" themeColor="textSecondary">
          Momento del aporte
        </ThemedText>
        <View style={styles.chipColumn}>
          {TIMING_OPTIONS.map((option) => (
            <OptionChip
              key={option.value}
              option={option}
              selected={input.depositTiming === option.value}
              onPress={() => onChange({ depositTiming: option.value })}
            />
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <CalculatorNumericField
          label="Tipo de interés anual"
          value={fieldValues.annualRatePercent}
          suffix="%"
          onChangeText={(text) => onChange({ annualRatePercent: parseCalculatorNumber(text) })}
        />
        <CalculatorNumericField
          label="Duración"
          value={fieldValues.durationYears}
          suffix="años"
          keyboardType="number-pad"
          onChangeText={(text) => {
            const parsed = Number.parseInt(text.replace(/\D/g, ''), 10);
            onChange({
              durationYears: Number.isFinite(parsed) ? parsed : input.durationYears,
            });
          }}
        />
      </View>

      {rateHint ? (
        <ThemedText type="caption" themeColor="textSecondary">
          {rateHint}
        </ThemedText>
      ) : null}

      <View style={[styles.actions, { borderTopColor: theme.border }]}>
        <Button label="Restablecer" variant="secondary" onPress={onReset} />
        <Button label="Calcular" onPress={onCalculate} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chipColumn: {
    gap: Spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actions: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
});
