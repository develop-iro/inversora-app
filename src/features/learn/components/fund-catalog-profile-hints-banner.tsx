import { Pressable, View } from 'react-native';

import type { ProfileCatalogHints } from '@/features/learn/services/map-profile-to-catalog-hints';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { TextHeading, TextParagraph } from '@/shared/components/text';

export type FundCatalogProfileHintsBannerProps = {
  hints: ProfileCatalogHints;
  isApplied: boolean;
  onApply: () => void;
  onDismiss: () => void;
};

/**
 * Suggests catalog filters based on the local educational profile without auto-applying them.
 */
export function FundCatalogProfileHintsBanner({
  hints,
  isApplied,
  onApply,
  onDismiss,
}: FundCatalogProfileHintsBannerProps) {
  if (isApplied) {
    return null;
  }

  return (
    <View className="gap-sm rounded-card border border-border-subtle bg-background-soft p-md">
      <TextHeading variant="card" themeColor="deepOcean">
        Filtros sugeridos según tu perfil
      </TextHeading>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {hints.summary}
      </TextParagraph>

      <View className="flex-row flex-wrap gap-sm">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aplicar filtros sugeridos del perfil educativo"
          onPress={onApply}
          className="rounded-chip bg-primary px-md py-sm active:opacity-90"
        >
          <TextParagraph variant="emphasis" themeColor="textOnPrimary">
            Aplicar filtros sugeridos
          </TextParagraph>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ocultar sugerencia de filtros"
          onPress={onDismiss}
          className="rounded-chip border border-border px-md py-sm active:opacity-90"
        >
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Ahora no
          </TextParagraph>
        </Pressable>
      </View>

      <LegalNotice
        title="Sugerencia educativa"
        body="Estos filtros son orientativos y no constituyen una recomendación de inversión personalizada."
      />
    </View>
  );
}
