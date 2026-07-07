import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { ScoringStatus } from '@/core/scoring/types';
import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundDataQualityBannerProps = {
  status: ScoringStatus;
};

export function FundDataQualityBanner({ status }: FundDataQualityBannerProps) {
  const theme = useTheme();

  if (status === 'ok') {
    return null;
  }

  const isQuarantined = status === 'quarantined';

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.banner,
        {
          backgroundColor: isQuarantined ? theme.dangerBannerSurface : theme.warningBannerSurface,
          borderColor: isQuarantined ? theme.dangerBannerBorder : theme.warningBannerBorder,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={isQuarantined ? 'alert-circle-outline' : 'alert-outline'}
        size={18}
        color={isQuarantined ? theme.dangerBadgeLabel : theme.deepOcean}
      />
      <View style={styles.textBlock}>
        <TextParagraph variant="emphasis">
          {isQuarantined ? 'Datos en revisión' : 'Datos con advertencias'}
        </TextParagraph>
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {isQuarantined
            ? 'Este fondo no debería usarse para comparar hasta resolver inconsistencias en las fuentes. Consulta siempre la ficha oficial del gestor.'
            : 'Algunas métricas pueden estar incompletas o desactualizadas. Interpreta el score y las ratios con precaución.'}
        </TextParagraph>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
});
