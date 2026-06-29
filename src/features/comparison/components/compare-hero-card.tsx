import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

/**
 * Hero promo card for the compare empty state (high-contrast deep surface).
 */
export function CompareHeroCard() {
  const theme = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: theme.deepOcean }]}
      accessibilityRole="summary"
      accessibilityLabel="Compara fondos con criterios educativos objetivos"
    >
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: 'rgba(184, 242, 230, 0.18)' }]}>
          <ThemedText type="metaLabel" style={styles.badgeText}>
            Guía educativa
          </ThemedText>
        </View>
        <MaterialCommunityIcons name="scale-balance" size={28} color={theme.primary} />
      </View>

      <ThemedText type="bodyBold" themeColor="textOnDark">
        Compara con criterios claros
      </ThemedText>
      <ThemedText type="caption" style={styles.subtitle}>
        TER, tracking error, riesgo y Score Inversora en una sola vista. Sin recomendación de
        inversión.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  badgeText: {
    color: '#B8F2E6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.78)',
    lineHeight: 20,
  },
});
