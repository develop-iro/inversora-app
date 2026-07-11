import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

export type FundCatalogSoraChipProps = {
  query: string;
  onPress: () => void;
};

export function FundCatalogSoraChip({ query, onPress }: FundCatalogSoraChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Preguntar a SORA sobre ${query}`}
      onPress={onPress}
      className="flex-row items-center gap-xs self-start rounded-pill border border-primary-border bg-soft-teal-surface px-md py-sm active:opacity-[0.88]"
    >
      <MaterialCommunityIcons name="robot-outline" size={16} color={theme.deepOcean} />
      <TextParagraph variant="secondary" themeColor="deepOcean">
        Preguntar a SORA: «{query.trim()}»
      </TextParagraph>
    </Pressable>
  );
}
