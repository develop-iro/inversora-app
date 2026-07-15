import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { CompareHeroCard } from '@/features/comparison/components/compare-hero-card';
import { CompareSuggestedPairCard } from '@/features/comparison/components/compare-suggested-pair-card';
import {
  COMPARE_METRIC_TIPS,
  COMPARE_SUGGESTED_PAIRS,
} from '@/features/comparison/constants/compare-suggested-pairs.config';
import {
  ScreenQuickAction,
  ScreenQuickActionsRow,
  SectionCard,
} from '@/shared/components/layout';
import { TextParagraph } from '@/shared/components/text';
import { Card } from '@/shared/components/ui/card';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { routes } from '@/shared/navigation/routes';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

/** Switch suggested pairs from horizontal scroll to a wrapped grid. */
const COMPARE_PAIR_GRID_BREAKPOINT = 640;

export type CompareEmptyBodyProps = {
  favoriteIsins: readonly string[];
  onOpenPicker: () => void;
  onApplyPair: (isins: readonly string[]) => void;
};

/**
 * Rich empty state encouraging users to start a fund comparison.
 */
export function CompareEmptyBody({
  favoriteIsins,
  onOpenPicker,
  onApplyPair,
}: CompareEmptyBodyProps) {
  const theme = useTheme();
  const router = useRouter();
  const { contentWidth } = useMobileLayout();
  const usePairGrid = contentWidth >= COMPARE_PAIR_GRID_BREAKPOINT;
  const canCompareFavorites = favoriteIsins.length >= 2;

  return (
    <View className="gap-lg">
      <CompareHeroCard />

      <SectionCard
        title="Nueva comparación"
        borderless
        contentClassName="gap-sm p-0 pt-0"
      >
        <ScreenQuickActionsRow className="gap-lg">
          <ScreenQuickAction
            icon="magnify-plus-outline"
            label="Buscar fondo"
            accessibilityLabel="Buscar fondo en el catálogo"
            onPress={onOpenPicker}
            variant="accent"
          />
          <ScreenQuickAction
            icon="lightning-bolt-outline"
            label="Par sugerido"
            accessibilityLabel="Cargar comparación sugerida Mundo versus EE.UU."
            onPress={() => onApplyPair(COMPARE_SUGGESTED_PAIRS[0].isins)}
          />
          <ScreenQuickAction
            icon="heart-outline"
            label="Favoritos"
            accessibilityLabel={
              canCompareFavorites
                ? 'Comparar fondos guardados en favoritos'
                : 'Necesitas al menos dos favoritos'
            }
            disabled={!canCompareFavorites}
            onPress={() => {
              if (canCompareFavorites) {
                onApplyPair(favoriteIsins.slice(0, 2));
              }
            }}
          />
          <ScreenQuickAction
            icon="view-grid-outline"
            label="Catálogo"
            accessibilityLabel="Abrir catálogo de fondos"
            onPress={() => router.push(routes.fundsCatalog)}
            variant="deep"
          />
        </ScreenQuickActionsRow>
      </SectionCard>

      <SectionCard
        title="Comparaciones sugeridas"
        borderless
        contentClassName="gap-sm p-0 pt-0"
      >
        {usePairGrid ? (
          <View className="flex-row flex-wrap gap-sm">
            {COMPARE_SUGGESTED_PAIRS.map((pair) => (
              <View key={pair.id} className="max-w-full grow basis-[220px]">
                <CompareSuggestedPairCard pair={pair} onPress={() => onApplyPair(pair.isins)} />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="items-start gap-sm py-xs"
          >
            {COMPARE_SUGGESTED_PAIRS.map((pair) => (
              <CompareSuggestedPairCard
                key={pair.id}
                pair={pair}
                className="w-[220px]"
                onPress={() => onApplyPair(pair.isins)}
              />
            ))}
          </ScrollView>
        )}
      </SectionCard>

      <SectionCard
        title="Qué vas a comparar"
        summary="Métricas que verás en la tabla cuando elijas dos fondos."
        borderless
        contentClassName="gap-sm p-0 pt-0"
      >
        <Card variant="outlined" contentClassName="gap-0 p-0">
          {COMPARE_METRIC_TIPS.map((tip, index) => (
            <View
              key={tip.id}
              accessibilityRole="text"
              accessibilityLabel={`${tip.title}: ${tip.description}`}
              className={cn(
                'flex-row items-start gap-md px-md py-md',
                index > 0 && 'border-t border-border',
              )}
            >
              <View className="h-8 w-8 items-center justify-center rounded-full bg-background-soft">
                <MaterialCommunityIcons name={tip.icon} size={18} color={theme.deepOcean} />
              </View>
              <View className="min-w-0 flex-1 gap-xs">
                <TextParagraph variant="emphasis">{tip.title}</TextParagraph>
                <TextParagraph variant="secondary" themeColor="textSecondary">
                  {tip.description}
                </TextParagraph>
              </View>
            </View>
          ))}
        </Card>
      </SectionCard>
    </View>
  );
}
