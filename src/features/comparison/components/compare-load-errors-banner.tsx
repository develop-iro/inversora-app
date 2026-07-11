import { View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';

export type CompareLoadErrorsBannerProps = {
  notFoundIsins: readonly string[];
};

/**
 * Surfaces ISINs that failed to load during comparison hydration.
 */
export function CompareLoadErrorsBanner({ notFoundIsins }: CompareLoadErrorsBannerProps) {
  if (notFoundIsins.length === 0) {
    return null;
  }

  const label =
    notFoundIsins.length === 1
      ? `No se pudo cargar el fondo ${notFoundIsins[0]}.`
      : `No se pudieron cargar ${notFoundIsins.length} fondos seleccionados.`;

  return (
    <View
      accessibilityRole="alert"
      className="gap-xs rounded-card border border-border bg-background-soft p-md"
    >
      <TextParagraph variant="emphasis">Carga incompleta</TextParagraph>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {label} Puedes quitarlos o intentar añadirlos de nuevo.
      </TextParagraph>
    </View>
  );
}
