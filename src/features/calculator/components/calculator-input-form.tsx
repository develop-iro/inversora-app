import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CompoundInterestInput, DepositFrequency, DepositTiming } from '@/features/calculator/models/compound-interest.engine';
import {
  EDUCATIONAL_RATE_SCENARIOS,
  type EducationalRateScenario,
} from '@/features/calculator/constants/educational-scenarios';
import {
  formatCalculatorInputNumber,
  parseCalculatorNumber,
} from '@/features/calculator/models/compound-interest.engine';
import { TextParagraph } from '@/shared/components/text';
import { InputNumeric } from '@/shared/components/inputs';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CalculatorInputFormProps = {
  input: CompoundInterestInput;
  fieldErrors?: Readonly<Partial<Record<keyof CompoundInterestInput, string>>>;
  rateScenario: EducationalRateScenario;
  showEducationalScenarios?: boolean;
  onScenarioChange: (scenario: EducationalRateScenario) => void;
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
      <TextParagraph variant="secondary" style={{ color: selected ? theme.deepOcean : theme.text }}>
        {option.label}
      </TextParagraph>
    </Pressable>
  );
}

/**
 * Calculator parameter form with shared numeric inputs and validation messages.
 */
export function CalculatorInputForm({
  input,
  fieldErrors = {},
  rateScenario,
  showEducationalScenarios = true,
  onScenarioChange,
  onChange,
  onCalculate,
  onReset,
  rateHint,
}: CalculatorInputFormProps) {
  const theme = useTheme();
  const activeScenarioDescription = EDUCATIONAL_RATE_SCENARIOS.find(
    (scenario) => scenario.id === rateScenario,
  )?.description;
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
      <TextParagraph variant="emphasis">¿Cuánto puedo ahorrar?</TextParagraph>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        Introduce cantidades en euros. El resultado es una simulación educativa, no una previsión
        garantizada.
      </TextParagraph>

      <View style={styles.row}>
        <InputNumeric
          label="Balance inicial"
          value={fieldValues.initialBalance}
          suffix="€"
          variant={fieldErrors.initialBalance ? 'error' : 'default'}
          message={fieldErrors.initialBalance}
          onChangeText={(text) => onChange({ initialBalance: parseCalculatorNumber(text) })}
        />
        <InputNumeric
          label="Aportación periódica"
          value={fieldValues.periodicDeposit}
          suffix="€"
          variant={fieldErrors.periodicDeposit ? 'error' : 'default'}
          message={fieldErrors.periodicDeposit}
          onChangeText={(text) => onChange({ periodicDeposit: parseCalculatorNumber(text) })}
        />
      </View>

      <View style={styles.fieldGroup}>
        <TextParagraph variant="secondary" themeColor="textSecondary">
          Frecuencia de aportación
        </TextParagraph>
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
        <TextParagraph variant="secondary" themeColor="textSecondary">
          Momento del aporte
        </TextParagraph>
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

      {showEducationalScenarios ? (
        <View style={styles.fieldGroup}>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Escenario educativo de rentabilidad
          </TextParagraph>
          <View style={styles.chipRow}>
            {EDUCATIONAL_RATE_SCENARIOS.map((scenario) => (
              <OptionChip
                key={scenario.id}
                option={{ value: scenario.id, label: scenario.label }}
                selected={rateScenario === scenario.id}
                onPress={() => onScenarioChange(scenario.id)}
              />
            ))}
          </View>
          {activeScenarioDescription ? (
            <TextParagraph variant="secondary" themeColor="textSecondary">
              {activeScenarioDescription}
            </TextParagraph>
          ) : null}
        </View>
      ) : null}

      <View style={styles.row}>
        <InputNumeric
          label="Tipo de interés anual"
          value={fieldValues.annualRatePercent}
          suffix="%"
          variant={fieldErrors.annualRatePercent ? 'error' : 'default'}
          message={fieldErrors.annualRatePercent}
          onChangeText={(text) => onChange({ annualRatePercent: parseCalculatorNumber(text) })}
        />
        <InputNumeric
          label="Duración"
          value={fieldValues.durationYears}
          suffix="años"
          keyboardType="number-pad"
          variant={fieldErrors.durationYears ? 'error' : 'default'}
          message={fieldErrors.durationYears}
          onChangeText={(text) => {
            const parsed = Number.parseInt(text.replace(/\D/g, ''), 10);
            onChange({
              durationYears: Number.isFinite(parsed) ? parsed : input.durationYears,
            });
          }}
        />
      </View>

      {rateHint ? (
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {rateHint}
        </TextParagraph>
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
