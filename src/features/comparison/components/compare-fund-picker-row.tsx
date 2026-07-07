import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { getFundScore } from '@/features/funds/utils/fund-summary';
import { FundCardIcon } from '@/features/funds/components/fund-card-icon';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { ScorePill } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CompareFundPickerRowProps = {
  fund: CatalogFund;
  disabled?: boolean;
  onPress: () => void;
};

function formatTer(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} %`;
}

/**
 * Compact catalog row for the compare fund picker modal.
 */
export function CompareFundPickerRow({
  fund,
  disabled = false,
  onPress,
}: CompareFundPickerRowProps) {
  const theme = useTheme();
  const score = getFundScore(fund);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Añadir ${fund.name} a la comparación`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
        pressed && !disabled && styles.rowPressed,
        disabled && styles.rowDisabled,
      ]}
    >
      <FundCardIcon symbol={fund.symbol} logoUrl={fund.logoUrl} style={styles.icon} />

      <View style={styles.copy}>
        <TextParagraph variant="emphasis" numberOfLines={2}>
          {fund.name}
        </TextParagraph>
        <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
          {fund.categoryLabel}
        </TextParagraph>
        <View style={styles.metaRow}>
          <TextLabel variant="meta" themeColor="textSecondary">
            TER {formatTer(fund.terPercent)}
          </TextLabel>
          <TextLabel variant="meta" themeColor="textSecondary">
            {fund.isin}
          </TextLabel>
        </View>
      </View>

      <View style={styles.trailing}>
        <ScorePill score={score} variant="compact" />
        <MaterialCommunityIcons
          name={disabled ? 'check-circle' : 'plus-circle-outline'}
          size={22}
          color={disabled ? theme.textSecondary : theme.primary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
  },
  rowPressed: {
    opacity: 0.9,
  },
  rowDisabled: {
    opacity: 0.72,
  },
  icon: {
    width: 40,
    height: 40,
  },
  copy: {
    flex: 1,
    gap: Spacing.xs,
    minWidth: 0,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
});
