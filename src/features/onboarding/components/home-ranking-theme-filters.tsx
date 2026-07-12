import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import type { InvestmentTheme } from '@/core/domain/investment-theme';
import type { RankingThemeOption } from '@/features/onboarding/utils/build-ranking-theme-options';
import { CarouselNavButton } from '@/shared/components/carousels';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type HomeRankingThemeFiltersProps = {
  themes: readonly RankingThemeOption[];
  selectedThemeId: InvestmentTheme | 'all';
  totalEligibleFunds: number;
  onThemeChange: (themeId: InvestmentTheme | 'all') => void;
};

type ThemeFilterListItem =
  | {
      readonly kind: 'all';
      readonly id: 'all';
      readonly label: 'Todos';
      readonly icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
      readonly fundCount: number;
    }
  | {
      readonly kind: 'theme';
      readonly id: InvestmentTheme;
      readonly label: string;
      readonly icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
      readonly fundCount: number;
    };

/** Matches `w-28` filter card width in logical pixels. */
const THEME_FILTER_CARD_WIDTH = 112;
const THEME_FILTER_CARD_GAP = Spacing.sm;
const THEME_FILTER_SCROLL_STEP = THEME_FILTER_CARD_WIDTH + THEME_FILTER_CARD_GAP;
const SCROLL_EDGE_EPSILON = 4;

type ThemeFilterScrollMetrics = {
  offset: number;
  contentWidth: number;
  layoutWidth: number;
};

const INITIAL_SCROLL_METRICS: ThemeFilterScrollMetrics = {
  offset: 0,
  contentWidth: 0,
  layoutWidth: 0,
};

/**
 * Horizontal thematic filters for the home ranking tab (category cards).
 */
export function HomeRankingThemeFilters({
  themes,
  selectedThemeId,
  totalEligibleFunds,
  onThemeChange,
}: HomeRankingThemeFiltersProps) {
  const theme = useTheme();
  const listRef = useRef<FlatList<ThemeFilterListItem>>(null);
  const [scrollMetrics, setScrollMetrics] =
    useState<ThemeFilterScrollMetrics>(INITIAL_SCROLL_METRICS);

  const items = useMemo((): ThemeFilterListItem[] => {
    return [
      {
        kind: 'all',
        id: 'all',
        label: 'Todos',
        icon: 'view-grid-outline',
        fundCount: totalEligibleFunds,
      },
      ...themes.map((item) => ({
        kind: 'theme' as const,
        id: item.id,
        label: item.label,
        icon: item.icon,
        fundCount: item.fundCount,
      })),
    ];
  }, [themes, totalEligibleFunds]);

  const canScrollBack = scrollMetrics.offset > SCROLL_EDGE_EPSILON;
  const canScrollForward =
    scrollMetrics.layoutWidth > 0 &&
    scrollMetrics.contentWidth > 0 &&
    scrollMetrics.offset + scrollMetrics.layoutWidth <
      scrollMetrics.contentWidth - SCROLL_EDGE_EPSILON;

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    setScrollMetrics({
      offset: contentOffset.x,
      contentWidth: contentSize.width,
      layoutWidth: layoutMeasurement.width,
    });
  }, []);

  const scrollByStep = useCallback(
    (direction: -1 | 1) => {
      const maxOffset = Math.max(0, scrollMetrics.contentWidth - scrollMetrics.layoutWidth);
      const nextOffset = Math.max(
        0,
        Math.min(maxOffset, scrollMetrics.offset + direction * THEME_FILTER_SCROLL_STEP),
      );

      listRef.current?.scrollToOffset({
        offset: nextOffset,
        animated: true,
      });
    },
    [scrollMetrics.contentWidth, scrollMetrics.layoutWidth, scrollMetrics.offset],
  );

  if (themes.length <= 1) {
    return null;
  }

  return (
    <View className="gap-sm">
      <View
        accessibilityRole="toolbar"
        accessibilityLabel="Navegar categorías del ranking"
        className="flex-row items-center gap-xs"
      >
        <CarouselNavButton
          direction="previous"
          disabled={!canScrollBack}
          accessibilityLabel="Ver categorías anteriores"
          accessibilityHint="Desplaza el listado de categorías hacia la izquierda"
          onPress={() => scrollByStep(-1)}
        />

        <View className="min-w-0 flex-1">
          <FlatList
            ref={listRef}
            horizontal
            nestedScrollEnabled
            data={items}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            snapToInterval={THEME_FILTER_SCROLL_STEP}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            onScroll={handleScroll}
            onContentSizeChange={(width) => {
              setScrollMetrics((current) => ({
                ...current,
                contentWidth: width,
              }));
            }}
            onLayout={(event) => {
              setScrollMetrics((current) => ({
                ...current,
                layoutWidth: event.nativeEvent.layout.width,
              }));
            }}
            contentContainerClassName="gap-sm pr-sm"
            accessibilityRole="tablist"
            accessibilityLabel="Filtrar ranking por categoría"
            renderItem={({ item }) => (
              <ThemeFilterCard
                label={item.label}
                icon={item.icon}
                valueLabel={`${item.fundCount}`}
                valueCaption="fondos"
                selected={selectedThemeId === item.id}
                onPress={() => onThemeChange(item.id)}
              />
            )}
          />
        </View>

        <CarouselNavButton
          direction="next"
          disabled={!canScrollForward}
          accessibilityLabel="Ver categorías siguientes"
          accessibilityHint="Desplaza el listado de categorías hacia la derecha"
          onPress={() => scrollByStep(1)}
        />
      </View>

      {selectedThemeId !== 'all' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver todas las categorías del ranking"
          onPress={() => onThemeChange('all')}
          className="min-h-[36px] flex-row items-center gap-xs self-start active:opacity-[0.85]"
        >
          <TextParagraph variant="emphasis" themeColor="primary">
            Ver todas las categorías
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
      className={cn(
        'min-h-[132px] w-28 items-center gap-xs rounded-card border px-sm py-md active:opacity-90',
        selected ? 'border-primary bg-background-soft' : 'border-border bg-surface',
      )}
    >
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full',
          selected ? 'bg-accent-mint' : 'bg-background-soft',
        )}
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
