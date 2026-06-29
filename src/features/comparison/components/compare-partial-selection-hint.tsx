import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CompareSuggestedPairCard } from '@/features/comparison/components/compare-suggested-pair-card';
import { COMPARE_SUGGESTED_PAIRS } from '@/features/comparison/constants/compare-suggested-pairs.config';
import { ScreenQuickAction } from '@/shared/components/layout/screen-quick-action';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type ComparePartialSelectionHintProps = {
  onOpenPicker: () => void;
  onApplyPair: (isins: readonly string[]) => void;
};

/**
 * Encourages adding a second fund when only one ISIN is selected.
 */
export function ComparePartialSelectionHint({
  onOpenPicker,
  onApplyPair,
}: ComparePartialSelectionHintProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.placeholderCard,
          {
            borderColor: theme.border,
            backgroundColor: theme.backgroundSoft,
          },
        ]}
      >
        <MaterialCommunityIcons name="plus-circle-outline" size={28} color={theme.primary} />
        <ThemedText type="bodyBold">Añade otro fondo</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.placeholderCopy}>
          Necesitas al menos dos para ver la tabla comparativa y preguntar a SORA.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="metaLabel" themeColor="textSecondary" style={styles.eyebrow}>
          Completar comparación
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActions}
        >
          <ScreenQuickAction
            icon="magnify-plus-outline"
            label="Buscar fondo"
            accessibilityLabel="Buscar segundo fondo"
            onPress={onOpenPicker}
            variant="accent"
          />
          <ScreenQuickAction
            icon="lightning-bolt-outline"
            label="Añadir sugerido"
            accessibilityLabel="Añadir par sugerido de comparación"
            onPress={() => onApplyPair(COMPARE_SUGGESTED_PAIRS[0].isins)}
          />
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText type="metaLabel" themeColor="textSecondary" style={styles.eyebrow}>
          Pares populares
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.lg,
  },
  placeholderCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  placeholderCopy: {
    textAlign: 'center',
    maxWidth: 280,
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
});
