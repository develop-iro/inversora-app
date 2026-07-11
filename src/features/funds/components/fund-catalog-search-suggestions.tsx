import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import type { FundSearchSuggestion } from '@/features/funds/utils/fund-search';
import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type FundCatalogSearchSuggestionsProps = {
  suggestions: FundSearchSuggestion[];
  onSelect: (suggestion: FundSearchSuggestion) => void;
  className?: string;
};

export function FundCatalogSearchSuggestions({
  suggestions,
  onSelect,
  className,
}: FundCatalogSearchSuggestionsProps) {
  const theme = useTheme();

  return (
    <View
      className={cn(
        'z-10 overflow-hidden rounded-card border border-border bg-surface shadow-card',
        className,
      )}
      accessibilityRole="list"
      accessibilityLabel={`${suggestions.length} sugerencias de fondos`}
    >
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={suggestion.isin}
          accessibilityRole="button"
          accessibilityLabel={`Seleccionar ${suggestion.name}, ISIN ${suggestion.isin}`}
          accessibilityHint="Completa la búsqueda con este fondo"
          onPress={() => onSelect(suggestion)}
          className={cn(
            'flex-row items-center gap-sm px-md py-sm active:opacity-[0.88]',
            index < suggestions.length - 1 && 'border-b border-border',
          )}
        >
          <View className="shrink-0">
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color={theme.textSecondary}
            />
          </View>
          <View className="min-w-0 flex-1 gap-half">
            <TextParagraph variant="emphasis" numberOfLines={1}>
              {suggestion.name}
            </TextParagraph>
            <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
              {suggestion.isin}
              {suggestion.categoryLabel ? ` · ${suggestion.categoryLabel}` : ''}
            </TextParagraph>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={theme.textSecondary} />
        </Pressable>
      ))}
    </View>
  );
}
