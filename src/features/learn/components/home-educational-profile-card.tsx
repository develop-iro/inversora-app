import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import { getEducationalProfileSummary } from '@/features/learn/services/build-educational-profile';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type HomeEducationalProfileCardProps = {
  profile: EducationalProfile;
  onOpenSuggestedCatalog: () => void;
  onRetakeQuestionnaire: () => void;
};

/**
 * Compact home entry when an orientative educational profile exists locally.
 */
export function HomeEducationalProfileCard({
  profile,
  onOpenSuggestedCatalog,
  onRetakeQuestionnaire,
}: HomeEducationalProfileCardProps) {
  const theme = useTheme();
  const summary = getEducationalProfileSummary(profile);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.softTealSurfaceFaint,
          borderColor: theme.borderSubtle,
        },
      ]}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="account-school-outline" size={20} color={theme.deepOcean} />
        <TextHeading variant="card" themeColor="deepOcean">
          Tu perfil orientativo
        </TextHeading>
      </View>

      <TextParagraph variant="secondary" themeColor="textSecondary">
        {summary}
      </TextParagraph>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver catálogo sugerido según tu perfil educativo"
          onPress={onOpenSuggestedCatalog}
          style={[styles.primaryAction, { backgroundColor: theme.primary }]}
        >
          <TextParagraph variant="emphasis" themeColor="textOnPrimary">
            Ver catálogo sugerido
          </TextParagraph>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Repetir cuestionario educativo"
          onPress={onRetakeQuestionnaire}
          style={[styles.secondaryAction, { borderColor: theme.border }]}
        >
          <TextParagraph variant="secondary" themeColor="deepOcean">
            Actualizar perfil
          </TextParagraph>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  primaryAction: {
    borderRadius: Radius.chip,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  secondaryAction: {
    borderWidth: 1,
    borderRadius: Radius.chip,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
});
