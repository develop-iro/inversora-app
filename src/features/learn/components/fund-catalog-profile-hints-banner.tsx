import { Pressable, StyleSheet, View } from 'react-native';

import type { ProfileCatalogHints } from '@/features/learn/services/map-profile-to-catalog-hints';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

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
  const theme = useTheme();

  if (isApplied) {
    return null;
  }

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.borderSubtle,
        },
      ]}
    >
      <TextHeading variant="card" themeColor="deepOcean">
        Filtros sugeridos según tu perfil
      </TextHeading>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {hints.summary}
      </TextParagraph>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aplicar filtros sugeridos del perfil educativo"
          onPress={onApply}
          style={[styles.primaryAction, { backgroundColor: theme.primary }]}
        >
          <TextParagraph variant="emphasis" themeColor="textOnPrimary">
            Aplicar filtros sugeridos
          </TextParagraph>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ocultar sugerencia de filtros"
          onPress={onDismiss}
          style={[styles.secondaryAction, { borderColor: theme.border }]}
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

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  primaryAction: {
    borderRadius: Radius.chip,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  secondaryAction: {
    borderWidth: 1,
    borderRadius: Radius.chip,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
});
