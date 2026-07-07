import { StyleSheet, View } from 'react-native';

import { CompareSuggestedPairCard } from '@/features/comparison/components/compare-suggested-pair-card';
import { COMPARE_SUGGESTED_PAIRS } from '@/features/comparison/constants/compare-suggested-pairs.config';
import {
  ScreenQuickAction,
  ScreenQuickActionsRow,
  SectionCard,
  SectionCardInsetScroll,
} from '@/shared/components/layout';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { Spacing } from '@/shared/theme/theme';

/** Switch suggested pairs from horizontal scroll to a wrapped grid. */
const COMPARE_PAIR_GRID_BREAKPOINT = 640;

export type ComparePartialSelectionHintProps = {
  onOpenPicker: () => void;
  onApplyPair: (isins: readonly string[]) => void;
};

/**
 * Secondary actions when only one fund is selected (header already shows the add slot).
 */
export function ComparePartialSelectionHint({
  onOpenPicker,
  onApplyPair,
}: ComparePartialSelectionHintProps) {
  const { contentWidth } = useMobileLayout();
  const usePairGrid = contentWidth >= COMPARE_PAIR_GRID_BREAKPOINT;

  return (
    <View style={styles.wrapper}>
      <SectionCard
        title="Completar comparación"
        borderless
        contentStyle={styles.nestedSectionContent}
      >
        <ScreenQuickActionsRow>
          <ScreenQuickAction
            icon="magnify-plus-outline"
            label="Buscar fondo"
            accessibilityLabel="Buscar segundo fondo"
            onPress={onOpenPicker}
            variant="accent"
          />
          <ScreenQuickAction
            icon="lightning-bolt-outline"
            label="Par sugerido"
            accessibilityLabel="Añadir par sugerido de comparación"
            onPress={() => onApplyPair(COMPARE_SUGGESTED_PAIRS[0].isins)}
          />
        </ScreenQuickActionsRow>
      </SectionCard>

      <SectionCard
        title="Pares populares"
        borderless
        bleedContent
        contentStyle={styles.nestedSectionContent}
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
          <SectionCardInsetScroll>
            {COMPARE_SUGGESTED_PAIRS.map((pair) => (
              <CompareSuggestedPairCard
                key={pair.id}
                pair={pair}
                style={styles.pairScrollCard}
                onPress={() => onApplyPair(pair.isins)}
              />
            ))}
          </SectionCardInsetScroll>
        )}
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.lg,
  },
  nestedSectionContent: {
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
  pairGridItem: {
    flexGrow: 1,
    flexBasis: 200,
    maxWidth: '100%',
  },
  pairScrollCard: {
    width: 220,
  },
});
