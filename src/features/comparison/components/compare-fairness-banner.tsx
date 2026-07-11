import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import type { CompareFairnessResult } from '@/features/comparison/models/compare-fund-entry';
import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

export type CompareFairnessBannerProps = {
  fairness: CompareFairnessResult;
};

/**
 * Warns when an educational comparison may not be technically homogeneous.
 */
export function CompareFairnessBanner({ fairness }: CompareFairnessBannerProps) {
  const theme = useTheme();

  if (fairness.isFair || fairness.warnings.length === 0) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      className="flex-row items-start gap-sm rounded-card border border-warning-banner-border bg-warning-banner-surface p-md"
    >
      <MaterialCommunityIcons name="information-outline" size={20} color={theme.deepOcean} />
      <View className="flex-1 gap-xs">
        <TextParagraph variant="emphasis">
          {fairness.warnings.length === 1
            ? fairness.warnings[0]
            : 'Comparación con matices'}
        </TextParagraph>
        {fairness.warnings.length > 1
          ? fairness.warnings.map((warning) => (
              <TextParagraph key={warning} variant="secondary" themeColor="textSecondary">
                {warning}
              </TextParagraph>
            ))
          : (
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Interpreta los resultados con cautela.
            </TextParagraph>
          )}
      </View>
    </View>
  );
}
