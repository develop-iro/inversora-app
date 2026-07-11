import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import type { ScoringStatus } from '@/core/scoring/types';
import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type FundDataQualityBannerProps = {
  status: ScoringStatus;
  className?: string;
};

export function FundDataQualityBanner({ status, className }: FundDataQualityBannerProps) {
  const theme = useTheme();

  if (status === 'ok') {
    return null;
  }

  const isQuarantined = status === 'quarantined';

  return (
    <View
      accessibilityRole="alert"
      className={cn(
        'flex-row items-start gap-sm rounded-card border p-md',
        isQuarantined
          ? 'border-danger-banner-border bg-danger-banner-surface'
          : 'border-warning-banner-border bg-warning-banner-surface',
        className,
      )}
    >
      <MaterialCommunityIcons
        name={isQuarantined ? 'alert-circle-outline' : 'alert-outline'}
        size={18}
        color={isQuarantined ? theme.dangerBadgeLabel : theme.deepOcean}
      />
      <View className="flex-1 gap-xs">
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
