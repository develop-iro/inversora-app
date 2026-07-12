import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import type { CompoundInterestInput, DepositFrequency } from '@/features/calculator/models/compound-interest.engine';
import {
  EDUCATIONAL_RATE_SCENARIOS,
  type EducationalRateScenario,
} from '@/features/calculator/constants/educational-scenarios';
import {
  formatLocalizedDecimal as formatCalculatorInputNumber,
  parseLocalizedNumber as parseCalculatorNumber,
} from '@/shared/components/inputs/input-utils';
import { TextParagraph } from '@/shared/components/text';
import { InputNumeric } from '@/shared/components/inputs';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn';

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

function OptionChip<T extends string>({
  option,
  selected,
  onPress,
}: {
  option: ChipOption<T>;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'rounded-chip border px-md py-sm',
        selected ? 'border-primary bg-background-soft' : 'border-border bg-surface',
      )}
    >
      <TextParagraph
        variant="secondary"
        themeColor={selected ? 'deepOcean' : 'text'}
      >
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
    <Card variant="outlined" contentClassName="gap-md">
      <TextParagraph variant="emphasis">¿Cuánto puedo ahorrar?</TextParagraph>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        Introduce cantidades en euros. El resultado es una simulación educativa, no una previsión
        garantizada.
      </TextParagraph>

      <View className="flex-row gap-md">
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

      <View className="gap-sm">
        <TextParagraph variant="secondary" themeColor="textSecondary">
          Frecuencia de aportación
        </TextParagraph>
        <View className="flex-row flex-wrap gap-sm">
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

      {showEducationalScenarios ? (
        <View className="gap-sm">
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Escenario educativo de rentabilidad
          </TextParagraph>
          <View className="flex-row flex-wrap gap-sm">
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

      <View className="flex-row gap-md">
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

      <View className="mt-lg flex-row flex-wrap justify-end gap-md border-t border-border pt-lg">
        <Button label="Restablecer" variant="secondary" onPress={onReset} />
        <Button label="Calcular" onPress={onCalculate} />
      </View>
    </Card>
  );
}
