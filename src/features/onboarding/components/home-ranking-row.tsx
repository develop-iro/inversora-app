import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import type { HomeRankingEntry } from '@/features/onboarding/services/resolve-home-search';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Badge, FundReturnChip, SkeletonBone } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import type { WithLoading } from '@/shared/types/component-loading';
import { cn } from '@/shared/utils/cn';
import { getRiskBadgeVariant, getRiskLabel } from '@/shared/utils/fund-risk';

type HomeRankingRowContentProps = {
  fund: HomeRankingEntry;
  highlightLabel?: string;
  onPress: () => void;
};

export type HomeRankingRowProps = WithLoading<HomeRankingRowContentProps>;

function HomeRankingRowLoading() {
  return (
    <View
      className="min-h-[96px] flex-row items-center gap-md rounded-field border border-border-subtle bg-surface-muted px-md py-md"
      accessibilityLabel="Cargando fila del ranking"
    >
      <SkeletonBone width={37} height={37} borderRadius={16} />
      <View className="flex-1 gap-sm">
        <SkeletonBone width="68%" height={16} />
        <SkeletonBone width="46%" height={12} />
      </View>
      <SkeletonBone width={44} height={28} borderRadius={9999} />
    </View>
  );
}

export function HomeRankingRow(props: HomeRankingRowProps) {
  if (props.loading) {
    return <HomeRankingRowLoading />;
  }

  return (
    <HomeRankingRowContent
      fund={props.fund}
      highlightLabel={props.highlightLabel}
      onPress={props.onPress}
    />
  );
}

function HomeRankingRowContent({
  fund,
  highlightLabel = 'Top fondo',
  onPress,
}: HomeRankingRowContentProps) {
  const theme = useTheme();
  const isHighlighted = fund.isHighlighted;
  const riskLabel = getRiskLabel(fund.riskLevel);
  const oneYearReturn = fund.returns.oneYear;
  const returnA11y =
    oneYearReturn === null
      ? ''
      : `, rentabilidad histórica a un año ${oneYearReturn.toFixed(1).replace('.', ',')} por ciento`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Posición ${fund.displayRank}, ${fund.name}, Score Inversora ${fund.score} sobre 100, riesgo ${riskLabel.toLowerCase()}, comisión anual ${fund.terPercent.toFixed(2)} por ciento${returnA11y}.`}
      accessibilityHint="Abre la ficha resumida del fondo"
      onPress={onPress}
      className={cn(
        'min-h-[96px] rounded-field bg-surface px-md py-md active:opacity-[0.92]',
        isHighlighted ? 'border-[1.5px] border-primary' : 'border border-border',
      )}
    >
      <View className="gap-xs">
        <View className="flex-row items-center justify-between gap-sm">
          <View className="flex-1 flex-row items-start gap-sm">
            <View
              className={cn(
                'mt-half min-h-[37px] min-w-[37px] items-center justify-center rounded-full border px-sm',
                isHighlighted
                  ? 'border-primary bg-primary'
                  : 'border-accent-mint bg-background-soft',
              )}
            >
              <TextLabel
                variant={isHighlighted ? 'chip' : 'meta'}
                themeColor={isHighlighted ? 'textOnDark' : 'textSecondary'}
                className={isHighlighted ? 'tracking-[-0.3px]' : 'tracking-[0.88px]'}
              >
                #{fund.displayRank}
              </TextLabel>
            </View>

            <View className="flex-1 gap-threeQuarter">
              {isHighlighted ? (
                <View className="mb-2xs self-start rounded-chip bg-background-soft px-sm py-half">
                  <TextLabel variant="meta" themeColor="primary">
                    {highlightLabel}
                  </TextLabel>
                </View>
              ) : null}

              <TextParagraph variant="emphasis" numberOfLines={1}>
                {fund.name}
              </TextParagraph>
              <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
                {fund.categoryLabel}
              </TextParagraph>
              <TextParagraph
                variant="secondary"
                themeColor="textSecondary"
                numberOfLines={1}
                className="text-[11px] leading-[14px] opacity-[0.62]"
              >
                ISIN {fund.isin}
              </TextParagraph>
            </View>
          </View>

          <View className="min-w-[88px] items-end gap-half">
            <TextLabel variant="meta" themeColor="textSecondary">
              Score Inversora
            </TextLabel>
            <TextLabel
              variant="chip"
              themeColor={isHighlighted ? 'primary' : 'text'}
              className="text-[18px] leading-6 tracking-[-0.3px]"
            >
              {fund.score}/100
            </TextLabel>
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-md">
          <View className="flex-1 flex-row flex-wrap items-center gap-sm">
            <Badge
              label={`Riesgo ${riskLabel.toLowerCase()}`}
              variant={getRiskBadgeVariant(fund.riskLevel)}
            />
            <FundReturnChip label="1A hist." value={oneYearReturn} />
            <TextParagraph
              variant="secondary"
              themeColor="textSecondary"
              className="text-[12px] leading-4"
            >
              Comisión anual {fund.terPercent.toFixed(2)}%
            </TextParagraph>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={isHighlighted ? theme.primary : theme.textSecondary}
          />
        </View>
      </View>
    </Pressable>
  );
}
