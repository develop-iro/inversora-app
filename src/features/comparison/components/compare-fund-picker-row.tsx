import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { getFundScore } from '@/features/funds/utils/fund-summary';
import { FundCardIcon } from '@/features/funds/components/fund-card-icon';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { ScorePill } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

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
      className={cn(
        'flex-row items-center gap-sm rounded-card border border-border bg-surface p-md active:opacity-90',
        disabled && 'opacity-[0.72]',
      )}
    >
      <FundCardIcon symbol={fund.symbol} logoUrl={fund.logoUrl} style={{ width: 40, height: 40 }} />

      <View className="min-w-0 flex-1 gap-xs">
        <TextParagraph variant="emphasis" numberOfLines={2}>
          {fund.name}
        </TextParagraph>
        <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
          {fund.categoryLabel}
        </TextParagraph>
        <View className="flex-row flex-wrap gap-sm">
          <TextLabel variant="meta" themeColor="textSecondary">
            TER {formatTer(fund.terPercent)}
          </TextLabel>
          <TextLabel variant="meta" themeColor="textSecondary">
            {fund.isin}
          </TextLabel>
        </View>
      </View>

      <View className="items-end gap-sm">
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
