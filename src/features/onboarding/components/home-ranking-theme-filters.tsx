import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import type { RankingThemeOption } from '@/features/onboarding/utils/build-ranking-theme-options';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { palette } from '@/shared/theme/palette';

export type HomeRankingThemeFiltersProps = {
  themes: readonly RankingThemeOption[];
  selectedThemeId: string | 'all';
  onThemeChange: (themeId: string | 'all') => void;
};

/**
 * Horizontal thematic filters for the home ranking tab (BBVA-style category cards).
 */
export function HomeRankingThemeFilters({
  themes,
  selectedThemeId,
  onThemeChange,
}: HomeRankingThemeFiltersProps) {
  const theme = useTheme();

  if (themes.length <= 1) {
    return null;
  }

  return (
    <View className="gap-sm">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-sm pr-lg"
        accessibilityRole="tablist"
        accessibilityLabel="Filtrar ranking por temática"
      >
        <ThemeFilterCard
          label="Todos"
          icon="view-grid-outline"
          valueLabel={`${themes.reduce((sum, item) => sum + item.fundCount, 0)}`}
          valueCaption="fondos"
          selected={selectedThemeId === 'all'}
          onPress={() => onThemeChange('all')}
        />

        {themes.map((item) => (
          <ThemeFilterCard
            key={item.id}
            label={item.label}
            icon={item.icon}
            valueLabel={`${item.topScore}`}
            valueCaption="puntos"
            selected={selectedThemeId === item.id}
            onPress={() => onThemeChange(item.id)}
          />
        ))}
      </ScrollView>

      {selectedThemeId !== 'all' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver todas las temáticas del ranking"
          onPress={() => onThemeChange('all')}
          className="min-h-[36px] flex-row items-center gap-xs self-start active:opacity-[0.85]"
        >
          <TextParagraph variant="emphasis" style={{ color: theme.primary }}>
            Ver todas las temáticas
          </TextParagraph>
          <MaterialCommunityIcons name="chevron-right" size={18} color={theme.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

type ThemeFilterCardProps = {
  label: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  valueLabel: string;
  valueCaption: string;
  selected: boolean;
  onPress: () => void;
};

function ThemeFilterCard({
  label,
  icon,
  valueLabel,
  valueCaption,
  selected,
  onPress,
}: ThemeFilterCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}, ${valueLabel} ${valueCaption}`}
      onPress={onPress}
      className="min-h-[132px] w-28 items-center gap-xs rounded-card border px-sm py-md active:opacity-90"
      style={{
        backgroundColor: selected ? theme.backgroundSoft : theme.surface,
        borderColor: selected ? theme.primary : theme.border,
      }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor: selected ? palette.mintAccent : theme.backgroundSoft,
        }}
      >
        <MaterialCommunityIcons name={icon} size={22} color={theme.primary} />
      </View>

      <TextLabel
        variant="listMeta"
        themeColor="textSecondary"
        numberOfLines={2}
        className="min-h-8 text-center"
      >
        {label}
      </TextLabel>

      <TextHeading variant="hero" themeColor="deepOcean" className="mt-half">
        {valueLabel}
      </TextHeading>
      <TextLabel
        variant="meta"
        themeColor="textSecondary"
        className="text-center lowercase tracking-[0.2px]"
      >
        {valueCaption}
      </TextLabel>
    </Pressable>
  );
}
