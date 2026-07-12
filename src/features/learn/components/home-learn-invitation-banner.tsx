import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import { TextHeading, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

export type HomeLearnInvitationBannerProps = {
  readonly onPressLearn: () => void;
};

/**
 * Persistent educational invitation on web when no orientative profile exists.
 */
export function HomeLearnInvitationBanner({ onPressLearn }: HomeLearnInvitationBannerProps) {
  const theme = useTheme();

  return (
    <View className="gap-sm rounded-card border border-border-subtle bg-soft-teal-surface-faint p-md">
      <View className="flex-row items-center gap-sm">
        <MaterialCommunityIcons
          name="book-open-page-variant-outline"
          size={20}
          color={theme.deepOcean}
        />
        <TextHeading variant="card" themeColor="deepOcean">
          Entiende antes de comparar
        </TextHeading>
      </View>

      <TextParagraph variant="secondary" themeColor="textSecondary">
        Completa el cuestionario orientativo para contextualizar rankings y catálogo. Es educativo,
        no sustituye asesoramiento personalizado.
      </TextParagraph>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quiero aprender, abrir cuestionario educativo"
        onPress={onPressLearn}
        className="mt-xs items-center rounded-chip bg-primary px-md py-sm active:opacity-90"
      >
        <TextParagraph variant="emphasis" themeColor="textOnPrimary">
          Quiero aprender
        </TextParagraph>
      </Pressable>
    </View>
  );
}
