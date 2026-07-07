import { StyleSheet, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { Spacing } from '@/shared/theme/theme';

export type FundDetailSheetFreshnessProps = {
  asOf: string;
};

function formatSheetReviewDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  if (!year || !month || !day) {
    return isoDate;
  }
  return `${day}/${month}/${year}`;
}

export function FundDetailSheetFreshness({ asOf }: FundDetailSheetFreshnessProps) {
  const formattedDate = formatSheetReviewDate(asOf);

  return (
    <View
      style={styles.wrapper}
      accessibilityRole="text"
      accessibilityLabel={`Ficha del fondo revisada en su totalidad el ${formattedDate}`}
    >
      <TextParagraph variant="secondary" themeColor="textSecondary">
        Ficha revisada en su totalidad el {formattedDate}. Las cifras de esta pantalla son
        orientativas y provienen de fuentes externas; no sustituyen la documentación oficial del
        gestor.
      </TextParagraph>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
});
