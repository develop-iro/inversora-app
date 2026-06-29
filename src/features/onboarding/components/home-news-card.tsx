import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { InvestmentNewsCategory, InvestmentNewsItem } from '@/core/domain/investment-news';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type HomeNewsCardProps = {
  item: InvestmentNewsItem;
  onPress?: (item: InvestmentNewsItem) => void;
};

const CATEGORY_LABELS: Record<InvestmentNewsCategory, string> = {
  concepto: 'Concepto',
  mercado: 'Mercado',
  regulacion: 'Aviso',
};

function formatPublishedDate(isoDate: string): string {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return parsed.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Compact news row for the home investment news section.
 */
export function HomeNewsCard({ item, onPress }: HomeNewsCardProps) {
  const theme = useTheme();
  const categoryLabel = CATEGORY_LABELS[item.category];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.summary}`}
      accessibilityHint={
        item.url ? 'Abre la fuente de la noticia' : 'Noticia informativa educativa'
      }
      onPress={() => {
        onPress?.(item);
      }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.metaRow}>
        <View
          style={[
            styles.categoryChip,
            { backgroundColor: 'rgba(0, 191, 166, 0.1)' },
          ]}
        >
          <ThemedText type="metaLabel" themeColor="deepOcean" style={styles.categoryLabel}>
            {categoryLabel}
          </ThemedText>
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          {formatPublishedDate(item.publishedAt)}
        </ThemedText>
      </View>

      <ThemedText type="bodyBold" style={styles.title}>
        {item.title}
      </ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.summary}>
        {item.summary}
      </ThemedText>

      <View style={styles.footer}>
        <ThemedText type="caption" themeColor="textSecondary">
          {item.source}
        </ThemedText>
        {item.url ? (
          <MaterialCommunityIcons name="open-in-new" size={14} color={theme.primary} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  cardPressed: {
    opacity: 0.9,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  categoryChip: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  categoryLabel: {
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.6,
  },
  title: {
    lineHeight: 22,
  },
  summary: {
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
});
