import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

/**
 * Hero promo card for the compare empty state (high-contrast deep surface).
 */
export function CompareHeroCard() {
  const theme = useTheme();

  return (
    <View
      className="gap-sm rounded-card bg-deep-ocean p-lg"
      accessibilityRole="summary"
      accessibilityLabel="Compara fondos con criterios educativos objetivos"
    >
      <View className="flex-row items-center justify-between">
        <View className="rounded-pill bg-accent-mint-surface px-md py-xs">
          <TextLabel variant="meta" themeColor="accentMintText" className="uppercase tracking-[0.5px]">
            Guía educativa
          </TextLabel>
        </View>
        <MaterialCommunityIcons name="scale-balance" size={28} color={theme.primary} />
      </View>

      <TextParagraph variant="emphasis" themeColor="textOnDark">
        Compara con criterios claros
      </TextParagraph>
      <TextParagraph variant="secondary" themeColor="textOnDarkMuted" className="leading-5">
        TER, tracking error, riesgo y Score Inversora en una sola vista. Sin recomendación de
        inversión.
      </TextParagraph>
    </View>
  );
}
