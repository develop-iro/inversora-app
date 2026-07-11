import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, View } from 'react-native';

import type { CompareFundEntry } from '@/features/comparison/models/compare-fund-entry';
import { FundCardIcon } from '@/features/funds/components/fund-card-icon';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Badge, Card, ScorePill } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export const COMPARE_VERSUS_CARD_MIN_WIDTH = 132;

export type CompareFundVersusHeaderProps = {
  entries: readonly CompareFundEntry[];
  onRemoveFund: (isin: string) => void;
  /** When one fund is selected, renders the second slot as an add action. */
  onAddFund?: () => void;
};

type FundVersusCardProps = {
  entry: CompareFundEntry;
  onRemoveFund: (isin: string) => void;
  compact?: boolean;
};

function VersusMarker() {
  return (
    <Badge
      label="vs"
      variant="muted"
      accessibilityLabel="Versus"
      className="min-h-[30px] min-w-[30px] self-center rounded-full px-sm"
    />
  );
}

function FundVersusCard({ entry, onRemoveFund, compact = false }: FundVersusCardProps) {
  const theme = useTheme();
  const { detail, isin } = entry;
  const fund = detail?.fund;
  const symbol = fund?.symbol ?? isin.slice(-4);
  const title = fund?.name ?? symbol;
  const subtitle = fund?.themeLabel ?? fund?.categoryLabel ?? 'Sin cargar';

  return (
    <Card
      variant="outlined"
      className={cn('min-w-0 flex-1', compact && 'w-[160px] flex-none')}
      contentClassName="min-h-[120px] flex-1 justify-between gap-xs p-md"
    >
      <View className="flex-row items-start justify-between">
        {fund !== undefined ? (
          <FundCardIcon symbol={symbol} logoUrl={fund.logoUrl} style={{ width: 32, height: 32 }} />
        ) : (
          <View className="h-8 w-8 items-center justify-center rounded-image border border-border bg-background-soft">
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

      <TextParagraph variant="emphasis" numberOfLines={2}>
        {title}
      </TextParagraph>
      {fund !== undefined ? (
        <TextLabel variant="meta" themeColor="textSecondary" numberOfLines={1}>
          {symbol}
        </TextLabel>
      ) : null}
      <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
        {subtitle}
      </TextParagraph>

      {detail !== null ? (
        <ScorePill score={detail.inversoraScore} variant="compact" />
      ) : (
        <TextLabel variant="meta" themeColor="textSecondary">
          Sin cargar
        </TextLabel>
      )}
    </Card>
  );
}

function AddFundSlot({ onPress }: { onPress: () => void }) {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Añadir segundo fondo a la comparación"
      className="min-w-0 flex-1 border-dashed border-primary-border bg-primary-surface"
      contentClassName="min-h-[120px] flex-1 items-center justify-center gap-xs p-md"
    >
      <MaterialCommunityIcons name="plus-circle-outline" size={24} color={theme.primary} />
      <TextParagraph variant="emphasis" themeColor="primary" numberOfLines={2} className="text-center">
        Añadir fondo
      </TextParagraph>
    </Card>
  );
}

/**
 * Fund header with side-by-side "vs" layout for two funds, or horizontal scroll for more.
 */
export function CompareFundVersusHeader({
  entries,
  onRemoveFund,
  onAddFund,
}: CompareFundVersusHeaderProps) {
  if (entries.length === 0) {
    return null;
  }

  if (entries.length === 1 && onAddFund) {
    return (
      <View className="flex-row items-center gap-sm" accessibilityRole="summary">
        <FundVersusCard entry={entries[0]!} onRemoveFund={onRemoveFund} />
        <VersusMarker />
        <AddFundSlot onPress={onAddFund} />
      </View>
    );
  }

  if (entries.length === 2) {
    const [left, right] = entries;

    return (
      <View className="flex-row items-center gap-sm" accessibilityRole="summary">
        <FundVersusCard entry={left} onRemoveFund={onRemoveFund} />
        <VersusMarker />
        <FundVersusCard entry={right} onRemoveFund={onRemoveFund} />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-sm py-xs"
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
