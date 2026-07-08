import { Pressable, StyleSheet, View } from 'react-native';



import {

  formatCalculatorCurrency,

  type CompoundInterestBreakdown,

  type CompoundInterestInput,

  type CompoundInterestResult,

} from '@/features/calculator/models/compound-interest.engine';

import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';

import { Card } from '@/shared/components/ui/card';

import { useTheme } from '@/shared/hooks/use-theme';

import { Radius, Size, Spacing } from '@/shared/theme/theme';



export type CalculatorResultsSummaryProps = {

  result: CompoundInterestResult;

  input: CompoundInterestInput;

  onViewEvolutionPress?: () => void;

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

  onViewEvolutionPress,

}: CalculatorResultsSummaryProps) {

  const theme = useTheme();



  return (

    <Card variant="elevated" style={styles.card}>

      <TextLabel variant="meta" themeColor="textSecondary">

        Resultado ilustrativo

      </TextLabel>

      <TextHeading variant="section" style={{ color: theme.deepOcean }}>

        Puedes acumular{' '}

        <TextHeading variant="section" style={{ color: theme.primary }}>

          {formatCalculatorCurrency(result.finalBalance)}

        </TextHeading>

      </TextHeading>

      <TextParagraph variant="secondary" themeColor="textSecondary">

        {buildContributionCaption(input)} · tipo {input.annualRatePercent.toFixed(2).replace('.', ',')}%

        anual

      </TextParagraph>

      {onViewEvolutionPress ? (

        <Pressable

          accessibilityRole="button"

          accessibilityLabel="Ver evolución anual del balance"

          accessibilityHint="Desplaza la pantalla hasta el gráfico de evolución anual"

          onPress={onViewEvolutionPress}

          style={({ pressed }) => [styles.evolutionLink, pressed && styles.evolutionLinkPressed]}

        >

          <TextParagraph variant="secondary" themeColor="primary">

            Ver evolución anual

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

  { key: 'initial', label: 'Balance inicial', colorKey: 'deepOcean' as const },

  { key: 'deposits', label: 'Aportaciones', colorKey: 'primary' as const },

  { key: 'interest', label: 'Interés acumulado', colorKey: 'chartInterest' as const },

] as const;



/**

 * Color legend for the final balance composition.

 */

export function CalculatorBreakdownLegend({ breakdown }: CalculatorBreakdownLegendProps) {

  const theme = useTheme();



  const values = {

    initial: breakdown.initialComponent,

    deposits: breakdown.depositsComponent,

    interest: breakdown.interestComponent,

  };



  return (

    <View style={styles.legend}>

      {LEGEND_ITEMS.map((item) => (

        <View key={item.key} style={styles.legendRow}>

          <View style={[styles.swatch, { backgroundColor: theme[item.colorKey] }]} />

          <TextParagraph variant="secondary" style={styles.legendLabel}>

            {item.label}

          </TextParagraph>

          <TextParagraph variant="emphasis">{formatCalculatorCurrency(values[item.key])}</TextParagraph>

        </View>

      ))}

    </View>

  );

}



const styles = StyleSheet.create({

  card: {

    gap: Spacing.sm,

  },

  evolutionLink: {

    alignSelf: 'flex-start',

    marginTop: Spacing.xs,

    paddingVertical: Spacing.xs,

  },

  evolutionLinkPressed: {

    opacity: 0.82,

  },

  legend: {

    gap: Spacing.sm,

  },

  legendRow: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: Spacing.sm,

  },

  swatch: {

    width: Size.legendSwatch,

    height: Size.legendSwatch,

    borderRadius: Radius.xs,

  },

  legendLabel: {

    flex: 1,

  },

});

