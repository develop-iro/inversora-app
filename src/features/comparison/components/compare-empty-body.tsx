import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

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
import { InvestmentCard } from '@/shared/components/ui/card';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { routes } from '@/shared/navigation/routes';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

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
    <View style={styles.wrapper}>
      <CompareHeroCard />

      <SectionCard title="Nueva comparación" borderless contentStyle={styles.sectionContent}>
        <ScreenQuickActionsRow>
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
        contentStyle={styles.sectionContent}
      >
        {usePairGrid ? (
          <View style={styles.pairGrid}>
            {COMPARE_SUGGESTED_PAIRS.map((pair) => (
              <View key={pair.id} style={styles.pairGridItem}>
                <CompareSuggestedPairCard pair={pair} onPress={() => onApplyPair(pair.isins)} />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pairScroll}
          >
            {COMPARE_SUGGESTED_PAIRS.map((pair) => (
              <CompareSuggestedPairCard
                key={pair.id}
                pair={pair}
                style={styles.pairScrollCard}
                onPress={() => onApplyPair(pair.isins)}
              />
            ))}
          </ScrollView>
        )}
      </SectionCard>

      <SectionCard title="Qué vas a comparar" borderless contentStyle={styles.sectionContent}>
        <View style={styles.tipsGrid}>
          {COMPARE_METRIC_TIPS.map((tip) => (
            <InvestmentCard
              key={tip.id}
              style={styles.tipCard}
              icon={
                <View style={[styles.tipIcon, { backgroundColor: theme.backgroundSoft }]}>
                  <MaterialCommunityIcons name={tip.icon} size={18} color={theme.deepOcean} />
                </View>
              }
              title={tip.title}
              subtitle={tip.description}
            />
          ))}
        </View>
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.lg,
  },
  sectionContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    gap: Spacing.sm,
  },
  pairGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pairScroll: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  pairGridItem: {
    flexGrow: 1,
    flexBasis: 220,
    maxWidth: '100%',
  },
  pairScrollCard: {
    width: 220,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tipCard: {
    flexGrow: 1,
    flexBasis: 160,
    minWidth: 140,
    minHeight: 132,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
