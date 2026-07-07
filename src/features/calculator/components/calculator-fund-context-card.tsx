import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import type { IllustrativeFundRate } from '@/features/calculator/utils/derive-fund-illustrative-rate';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Button, Card, Spinner } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

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
      <Card variant="outlined" style={styles.card}>
        <View style={styles.emptyState}>
          <View style={[styles.iconWrap, { backgroundColor: theme.backgroundSoft }]}>
            <MaterialCommunityIcons name="chart-line-variant" size={20} color={theme.deepOcean} />
          </View>
          <View style={styles.copy}>
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
    <Card variant="outlined" style={styles.card}>
      <View style={styles.selectedHeader}>
        <View style={styles.selectedCopy}>
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
        <Spinner size="sm" accessibilityLabel="Cargando datos del fondo" style={styles.loader} />
      ) : fundRate ? (
        <View style={[styles.rateBox, { backgroundColor: theme.backgroundSoft }]}>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Tipo anual ilustrativo (neto de TER)
          </TextParagraph>
          <TextHeading variant="section" style={styles.rateValue}>
            {fundRate.annualRatePercent.toFixed(2).replace('.', ',')}%
          </TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Histórico {fundRate.timeframeLabel}: {fundRate.grossRatePercent.toFixed(2).replace('.', ',')}%
            bruto · TER {fundRate.terPercent.toFixed(2).replace('.', ',')}% · {fundRate.sourceLabel}
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

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  emptyState: {
    gap: Spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: Spacing.xs,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  selectedCopy: {
    flex: 1,
    gap: Spacing.xs,
  },
  loader: {
    alignSelf: 'flex-start',
  },
  rateBox: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  rateValue: {
    lineHeight: 28,
  },
});
