import { View } from 'react-native';

import { CompareSuggestedPairCard } from '@/features/comparison/components/compare-suggested-pair-card';
import { COMPARE_SUGGESTED_PAIRS } from '@/features/comparison/constants/compare-suggested-pairs.config';
import {
  ScreenQuickAction,
  ScreenQuickActionsRow,
  SectionCard,
  SectionCardInsetScroll,
} from '@/shared/components/layout';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';

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
    <View className="gap-lg">
      <SectionCard
        title="Completar comparación"
        borderless
        contentClassName="gap-sm p-0 pt-0 pb-0"
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
        contentClassName="gap-sm p-0 pt-0 pb-0"
      >
        {usePairGrid ? (
          <View className="flex-row flex-wrap gap-sm">
            {COMPARE_SUGGESTED_PAIRS.map((pair) => (
              <View key={pair.id} className="max-w-full grow basis-[200px]">
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
                className="w-[220px]"
                onPress={() => onApplyPair(pair.isins)}
              />
            ))}
          </SectionCardInsetScroll>
        )}
      </SectionCard>
    </View>
  );
}
