import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { CompareFundEntry } from '@/features/comparison/models/compare-fund-entry';
import { FundCardIcon } from '@/features/onboarding/components/fund-card-icon';
import { ThemedText } from '@/shared/components/themed-text';
import { ScorePill } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export const COMPARE_VERSUS_CARD_MIN_WIDTH = 132;

export type CompareFundVersusHeaderProps = {
  entries: readonly CompareFundEntry[];
  onRemoveFund: (isin: string) => void;
};

type FundVersusCardProps = {
  entry: CompareFundEntry;
  onRemoveFund: (isin: string) => void;
  compact?: boolean;
};

function FundVersusCard({ entry, onRemoveFund, compact = false }: FundVersusCardProps) {
  const theme = useTheme();
  const { detail, isin } = entry;
  const fund = detail?.fund;
  const symbol = fund?.symbol ?? isin.slice(-4);
  const subtitle = fund?.themeLabel ?? fund?.categoryLabel ?? 'Sin cargar';

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        {
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
      ]}
    >
      <View style={styles.cardTop}>
        {fund !== undefined ? (
          <FundCardIcon symbol={symbol} logoUrl={fund.logoUrl} style={styles.icon} />
        ) : (
          <View
            style={[
              styles.iconPlaceholder,
              { backgroundColor: theme.backgroundSoft, borderColor: theme.border },
            ]}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={theme.textSecondary} />
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Quitar ${fund?.name ?? isin}`}
          onPress={() => onRemoveFund(isin)}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="close" size={18} color={theme.textSecondary} />
        </Pressable>
      </View>

      <ThemedText type="bodyBold" numberOfLines={1}>
        {symbol}
      </ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
        {subtitle}
      </ThemedText>

      {detail !== null ? (
        <ScorePill score={detail.inversoraScore} variant="compact" />
      ) : (
        <ThemedText type="metaLabel" themeColor="textSecondary">
          Sin cargar
        </ThemedText>
      )}
    </View>
  );
}

/**
 * Fund header with side-by-side "vs" layout for two funds, or horizontal scroll for more.
 */
export function CompareFundVersusHeader({
  entries,
  onRemoveFund,
}: CompareFundVersusHeaderProps) {
  const theme = useTheme();

  if (entries.length === 0) {
    return null;
  }

  if (entries.length === 2) {
    const [left, right] = entries;

    return (
      <View style={styles.dualRow} accessibilityRole="summary">
        <FundVersusCard entry={left} onRemoveFund={onRemoveFund} />
        <View
          style={[styles.versusBadge, { backgroundColor: theme.backgroundSoft, borderColor: theme.border }]}
          accessibilityLabel="Versus"
        >
          <ThemedText type="metaLabel" themeColor="textSecondary">
            vs
          </ThemedText>
        </View>
        <FundVersusCard entry={right} onRemoveFund={onRemoveFund} />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.multiScroll}
      accessibilityRole="list"
      accessibilityLabel="Fondos seleccionados para comparar"
    >
      {entries.map((entry) => (
        <FundVersusCard
          key={entry.isin}
          entry={entry}
          onRemoveFund={onRemoveFund}
          compact
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dualRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    minWidth: 0,
  },
  cardCompact: {
    flex: 0,
    width: COMPARE_VERSUS_CARD_MIN_WIDTH + 28,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  icon: {
    width: 32,
    height: 32,
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: Radius.image,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versusBadge: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiScroll: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});
