import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CompareHeroCard } from '@/features/comparison/components/compare-hero-card';
import { CompareSuggestedPairCard } from '@/features/comparison/components/compare-suggested-pair-card';
import {
  COMPARE_METRIC_TIPS,
  COMPARE_SUGGESTED_PAIRS,
} from '@/features/comparison/constants/compare-suggested-pairs.config';
import { ScreenQuickAction } from '@/shared/components/layout/screen-quick-action';
import { ThemedText } from '@/shared/components/themed-text';
import { InvestmentCard } from '@/shared/components/ui/card';
import { routes } from '@/shared/navigation/routes';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

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
  const canCompareFavorites = favoriteIsins.length >= 2;

  return (
    <View style={styles.wrapper}>
      <CompareHeroCard />

      <View style={styles.section}>
        <ThemedText type="metaLabel" themeColor="textSecondary" style={styles.eyebrow}>
          Nueva comparación
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActions}
        >
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
            label="Desde favoritos"
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
            label="Ir al catálogo"
            accessibilityLabel="Abrir catálogo de fondos"
            onPress={() => router.push(routes.fundsCatalog)}
            variant="deep"
          />
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText type="metaLabel" themeColor="textSecondary" style={styles.eyebrow}>
          Comparaciones sugeridas
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pairScroll}
        >
          {COMPARE_SUGGESTED_PAIRS.map((pair) => (
            <CompareSuggestedPairCard
              key={pair.id}
              pair={pair}
              onPress={() => onApplyPair(pair.isins)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText type="metaLabel" themeColor="textSecondary" style={styles.eyebrow}>
          Qué vas a comparar
        </ThemedText>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  quickActions: {
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  pairScroll: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tipCard: {
    width: '31%',
    minWidth: 100,
    flexGrow: 1,
    minHeight: 132,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
