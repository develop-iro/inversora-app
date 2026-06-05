import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { HomeRankingEntry } from '@/features/onboarding/services/resolve-home-search';
import { ThemedText } from '@/shared/components/themed-text';
import { Badge } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';
import { getRiskBadgeVariant, getRiskLabel } from '@/shared/utils/fund-risk';

export type HomeRankingRowProps = {
  fund: HomeRankingEntry;
  highlightLabel?: string;
  onPress: () => void;
};

export function HomeRankingRow({ fund, highlightLabel = 'Top fondo', onPress }: HomeRankingRowProps) {
  const theme = useTheme();
  const isHighlighted = fund.isHighlighted;
  const riskLabel = getRiskLabel(fund.riskLevel);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Posición ${fund.displayRank}, ${fund.name}, Score Inversora ${fund.score} sobre 100, riesgo ${riskLabel.toLowerCase()}, comisión anual ${fund.terPercent.toFixed(2)} por ciento.`}
      accessibilityHint="Abre la ficha resumida del fondo"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: isHighlighted ? theme.backgroundSoft : theme.surface,
          borderColor: isHighlighted ? 'rgba(0, 191, 166, 0.35)' : theme.border,
        },
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.mainContent}>
        <View style={styles.mainRow}>
          <View style={styles.rankAndInfoBlock}>
            <View
              style={[
                styles.rankIndicator,
                isHighlighted
                  ? {
                      backgroundColor: 'rgba(19, 78, 94, 0.92)',
                      borderColor: 'rgba(0, 191, 166, 0.22)',
                    }
                  : {
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.border,
                    },
              ]}
            >
              <ThemedText
                type={isHighlighted ? 'chip' : 'metaLabel'}
                style={{
                  color: isHighlighted ? theme.textOnDark : theme.textSecondary,
                  letterSpacing: isHighlighted ? -0.3 : 0.88,
                }}
              >
                #{fund.displayRank}
              </ThemedText>
            </View>

            <View style={styles.textBlock}>
              {isHighlighted ? (
                <View style={[styles.highlightBadge, { backgroundColor: theme.accentMint }]}>
                  <ThemedText type="caption" style={styles.highlightBadgeLabel}>
                    {highlightLabel}
                  </ThemedText>
                </View>
              ) : null}

              <ThemedText type="bodyBold" numberOfLines={1}>
                {fund.name}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
                {fund.categoryLabel}
              </ThemedText>
              <ThemedText
                type="caption"
                themeColor="textSecondary"
                numberOfLines={1}
                style={styles.isinText}
              >
                ISIN {fund.isin}
              </ThemedText>
            </View>
          </View>

          <View style={styles.scoreBlock}>
            <ThemedText type="metaLabel" themeColor="textSecondary">
              Score Inversora
            </ThemedText>
            <ThemedText type="chip" style={styles.scoreValue}>
              {fund.score}/100
            </ThemedText>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Badge
              label={`Riesgo ${riskLabel.toLowerCase()}`}
              variant={getRiskBadgeVariant(fund.riskLevel)}
            />
            <ThemedText type="caption" themeColor="textSecondary" style={styles.annualFeeText}>
              Comisión anual {fund.terPercent.toFixed(2)}%
            </ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={theme.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: 96,
  },
  rowPressed: {
    opacity: 0.92,
  },
  mainContent: {
    gap: Spacing.xs,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  rankAndInfoBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  rankIndicator: {
    minWidth: 37,
    minHeight: 37,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    marginTop: 2,
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  highlightBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: 1,
  },
  highlightBadgeLabel: {
    fontSize: 11,
    lineHeight: 15,
  },
  isinText: {
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.62,
  },
  scoreBlock: {
    alignItems: 'flex-end',
    gap: 2,
    minWidth: 88,
  },
  scoreValue: {
    letterSpacing: -0.3,
    fontSize: 18,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    flex: 1,
  },
  annualFeeText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
