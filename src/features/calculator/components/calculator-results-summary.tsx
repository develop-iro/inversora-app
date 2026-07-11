import { Pressable, View } from 'react-native';

import {
  formatCalculatorCurrency,
  type CompoundInterestBreakdown,
  type CompoundInterestInput,
  type CompoundInterestResult,
} from '@/features/calculator/models/compound-interest.engine';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn';

export type CalculatorResultsSummaryProps = {
  result: CompoundInterestResult;
  input: CompoundInterestInput;
  onViewYearlyDetailPress?: () => void;
};

function buildContributionCaption(input: CompoundInterestInput): string {
  const frequencyLabel = input.depositFrequency === 'monthly' ? 'mensual' : 'anual';

  return `Aportación ${formatCalculatorCurrency(input.periodicDeposit)} ${frequencyLabel} durante ${input.durationYears} años`;
}

/**
 * Headline result card for the compound interest simulation.
 */
export function CalculatorResultsSummary({
  result,
  input,
  onViewYearlyDetailPress,
}: CalculatorResultsSummaryProps) {
  return (
    <Card variant="elevated" contentClassName="gap-sm">
      <TextLabel variant="meta" themeColor="textSecondary">
        Resultado ilustrativo
      </TextLabel>
      <TextHeading variant="section" themeColor="deepOcean">
        Puedes acumular{' '}
        <TextHeading variant="section" themeColor="primary">
          {formatCalculatorCurrency(result.finalBalance)}
        </TextHeading>
      </TextHeading>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {buildContributionCaption(input)} · tipo {input.annualRatePercent.toFixed(2).replace('.', ',')}%
        anual
      </TextParagraph>
      {onViewYearlyDetailPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver detalle anual del balance"
          accessibilityHint="Desplaza la pantalla hasta la tabla de evolución anual"
          onPress={onViewYearlyDetailPress}
          className="mt-xs self-start py-xs active:opacity-[0.82]"
        >
          <TextParagraph variant="secondary" themeColor="primary">
            Ver detalle anual
          </TextParagraph>
        </Pressable>
      ) : null}
    </Card>
  );
}

export type CalculatorBreakdownLegendProps = {
  breakdown: CompoundInterestBreakdown;
};

const LEGEND_ITEMS = [
  { key: 'initial', label: 'Balance inicial', swatchClass: 'bg-deep-ocean' },
  { key: 'deposits', label: 'Aportaciones', swatchClass: 'bg-primary' },
  { key: 'interest', label: 'Interés acumulado', swatchClass: 'bg-chart-interest' },
] as const;

/**
 * Color legend for the final balance composition.
 */
export function CalculatorBreakdownLegend({ breakdown }: CalculatorBreakdownLegendProps) {
  const values = {
    initial: breakdown.initialComponent,
    deposits: breakdown.depositsComponent,
    interest: breakdown.interestComponent,
  };

  return (
    <View className="gap-sm">
      {LEGEND_ITEMS.map((item) => (
        <View key={item.key} className="flex-row items-center gap-sm">
          <View className={cn('h-3 w-3 rounded-xs', item.swatchClass)} />
          <TextParagraph variant="secondary" className="flex-1">
            {item.label}
          </TextParagraph>
          <TextParagraph variant="emphasis">{formatCalculatorCurrency(values[item.key])}</TextParagraph>
        </View>
      ))}
    </View>
  );
}
