import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { ThemedText } from '@/shared/components/themed-text';
import { Badge, ScorePill } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { getRiskBadgeVariant, getRiskLabel } from '@/shared/utils/fund-risk';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundListRowProps = {
  fund: CatalogFund;
  onPress?: () => void;
};

export function FundListRow({ fund, onPress }: FundListRowProps) {
  const theme = useTheme();
  const riskLabel = getRiskLabel(fund.riskLevel);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${fund.name}, ISIN ${fund.isin}, Score ${fund.invesoraScore}, riesgo ${riskLabel.toLowerCase()}, comisión ${fund.terPercent.toFixed(2)} por ciento`}
      accessibilityHint="Abre la ficha resumida del fondo"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.main}>
        <View style={styles.titleBlock}>
          {fund.rank != null ? (
            <ThemedText type="metaLabel" themeColor="deepOcean">
              #{fund.rank}
            </ThemedText>
          ) : null}
          <ThemedText type="bodyBold" numberOfLines={1}>
            {fund.name}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
            {fund.categoryLabel}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.isin}>
            ISIN {fund.isin}
          </ThemedText>
        </View>

        <View style={styles.scoreWrap}>
          <ScorePill score={fund.invesoraScore} />
        </View>
      </View>

      <View style={styles.meta}>
        <Badge
          label={`Riesgo ${riskLabel.toLowerCase()}`}
          variant={getRiskBadgeVariant(fund.riskLevel)}
        />
        <ThemedText type="caption" themeColor="textSecondary">
          TER {fund.terPercent.toFixed(2)}%
        </ThemedText>
        <MaterialCommunityIcons name="chevron-right" size={18} color={theme.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  pressed: {
    opacity: 0.92,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  isin: {
    fontSize: 11,
    opacity: 0.7,
  },
  scoreWrap: {
    alignItems: 'flex-end',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
