import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import { getEducationalProfileSummary } from '@/features/learn/services/build-educational-profile';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

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
    <View className="gap-sm rounded-card border border-border-subtle bg-soft-teal-surface-faint p-md">
      <View className="flex-row items-center gap-sm">
        <MaterialCommunityIcons name="account-school-outline" size={20} color={theme.deepOcean} />
        <TextHeading variant="card" themeColor="deepOcean">
          Tu perfil orientativo
        </TextHeading>
      </View>

      <TextParagraph variant="secondary" themeColor="textSecondary">
        {summary}
      </TextParagraph>

      <View className="mt-xs gap-sm">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver catálogo sugerido según tu perfil educativo"
          onPress={onOpenSuggestedCatalog}
          className="items-center rounded-chip bg-primary px-md py-sm active:opacity-90"
        >
          <TextParagraph variant="emphasis" themeColor="textOnPrimary">
            Ver catálogo sugerido
          </TextParagraph>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Repetir cuestionario educativo"
          onPress={onRetakeQuestionnaire}
          className="items-center rounded-chip border border-border px-md py-sm active:opacity-90"
        >
          <TextParagraph variant="secondary" themeColor="deepOcean">
            Actualizar perfil
          </TextParagraph>
        </Pressable>
      </View>
    </View>
  );
}
