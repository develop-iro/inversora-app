import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import type { LearnConceptCard } from '@/features/learn/constants/learn-questionnaire';
import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

export type LearnConceptCardListProps = {
  cards: readonly LearnConceptCard[];
};

/**
 * Wallet-style list of investing basics for educational info steps.
 */
export function LearnConceptCardList({ cards }: LearnConceptCardListProps) {
  const theme = useTheme();

  return (
    <View accessibilityRole="list" className="gap-sm">
      {cards.map((card) => (
        <View
          key={card.id}
          accessibilityLabel={`${card.title}. ${card.description}`}
          className="flex-row gap-md rounded-card border border-border-subtle bg-surface px-md py-md shadow-card"
        >
          <View className="h-12 w-12 shrink-0 items-center justify-center rounded-card bg-background-soft">
            <MaterialCommunityIcons name={card.icon} size={22} color={theme.deepOcean} />
          </View>
          <View className="min-w-0 flex-1 gap-xs">
            <TextParagraph variant="emphasis" className="text-[17px] leading-6">
              {card.title}
            </TextParagraph>
            <TextParagraph
              variant="secondary"
              themeColor="textSecondary"
              className="text-[16px] leading-[24px]"
            >
              {card.description}
            </TextParagraph>
          </View>
        </View>
      ))}
    </View>
  );
}
