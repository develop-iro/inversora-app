import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import type { IllustrativeFundRate } from '@/features/calculator/utils/derive-fund-illustrative-rate';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Button, Card, Spinner } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';

export type CalculatorFundContextCardProps = {
  selectedFund: CatalogFund | null;
  fundRate: IllustrativeFundRate | null;
  isLoading: boolean;
  errorMessage: string | null;
  onPickFund: () => void;
  onClearFund: () => void;
};

/**
 * Shows the selected fund and the illustrative rate used in the simulation.
 */
export function CalculatorFundContextCard({
  selectedFund,
  fundRate,
  isLoading,
  errorMessage,
  onPickFund,
  onClearFund,
}: CalculatorFundContextCardProps) {
  const theme = useTheme();

  if (selectedFund === null) {
    return (
      <Card variant="outlined" contentClassName="gap-md">
        <View className="gap-md">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-background-soft">
            <MaterialCommunityIcons name="chart-line-variant" size={20} color={theme.deepOcean} />
          </View>
          <View className="gap-xs">
            <TextParagraph variant="emphasis">Simular con un fondo concreto</TextParagraph>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Usamos un tipo anual ilustrativo basado en su histórico reciente y la comisión
              (TER). Puedes ajustarlo después.
            </TextParagraph>
          </View>
          <Button label="Elegir fondo" onPress={onPickFund} />
        </View>
      </Card>
    );
  }

  return (
    <Card variant="outlined" contentClassName="gap-md">
      <View className="flex-row items-start justify-between gap-sm">
        <View className="flex-1 gap-xs">
          <TextLabel variant="meta" themeColor="textSecondary">
            Fondo seleccionado
          </TextLabel>
          <TextParagraph variant="emphasis" numberOfLines={2}>
            {selectedFund.name}
          </TextParagraph>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            {selectedFund.isin}
          </TextParagraph>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quitar fondo seleccionado"
          onPress={onClearFund}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="close-circle-outline" size={22} color={theme.textSecondary} />
        </Pressable>
      </View>

      {isLoading ? (
        <Spinner size="sm" accessibilityLabel="Cargando datos del fondo" style={{ alignSelf: 'flex-start' }} />
      ) : fundRate ? (
        <View className="gap-xs rounded-card bg-background-soft p-md">
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Tipo anual ilustrativo (neto de TER)
          </TextParagraph>
          <TextHeading variant="section" className="leading-7">
            {fundRate.annualRatePercent.toFixed(2).replace('.', ',')}%
          </TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Histórico {fundRate.timeframeLabel}: {fundRate.grossRatePercent.toFixed(2).replace('.', ',')}%
            bruto · TER {fundRate.terPercent.toFixed(2).replace('.', ',')}% · {fundRate.sourceLabel}
            {fundRate.isPartialHistory
              ? ' · Estimación anualizada con menos de 1 año de cotización'
              : ''}
          </TextParagraph>
        </View>
      ) : null}

      {errorMessage ? (
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {errorMessage}
        </TextParagraph>
      ) : null}

      <Button label="Cambiar fondo" variant="secondary" onPress={onPickFund} />
    </Card>
  );
}
