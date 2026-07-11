import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Pressable, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { FavoriteToggleButton } from '@/features/funds/components/favorite-toggle-button';
import { FundMetricBlock } from '@/features/funds/components/fund-metric-block';
import { useFavorite } from '@/features/funds/hooks/use-favorite';
import {
  buildFundCardA11yLabel,
  getFundScore,
} from '@/features/funds/utils/fund-summary';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Badge, InfoHintTrigger, ScorePill, SkeletonBone, SkeletonPanel, SkeletonTextBlock } from '@/shared/components/ui';
import { InfoHintHost } from '@/shared/components/ui/info-hint-host';
import { useTheme } from '@/shared/hooks/use-theme';
import { isWeb } from '@/shared/platform/capabilities';
import { getEfficiencyBadgeVariant, getEfficiencyLabel } from '@/shared/utils/fund-efficiency';
import { getRiskBadgeVariant, getRiskLabel } from '@/shared/utils/fund-risk';
import { cn } from '@/shared/utils/cn';
import type { WithLoading } from '@/shared/types/component-loading';

type FundListRowContentProps = {
  fund: CatalogFund;
  onPress?: () => void;
  className?: string;
};

export type FundListRowProps = WithLoading<FundListRowContentProps>;

function FundListRowLoading() {
  return (
    <View accessibilityLabel="Cargando fila del catálogo">
      <SkeletonPanel padded={false}>
        <View className="flex-row items-center gap-md px-lg py-md">
          <SkeletonBone width={40} height={40} borderRadius={6} />
          <SkeletonTextBlock
            gap={4}
            lines={[
              { width: '72%', height: 14 },
              { width: '48%', height: 10 },
            ]}
          />
          <SkeletonBone width={44} height={28} borderRadius={9999} />
        </View>
      </SkeletonPanel>
    </View>
  );
}

/** Compact list card aligned with CardFund design tokens. */
const rowPressableA11y = (fund: CatalogFund, efficiencyLabel: string) => ({
  accessibilityRole: 'button' as const,
  accessibilityLabel: buildFundCardA11yLabel(fund, efficiencyLabel),
  accessibilityHint: 'Abre la ficha resumida del fondo',
});

function FundListRowContent({
  fund,
  score,
  efficiencyLabel,
  riskLabel,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
}: {
  fund: CatalogFund;
  score: number;
  efficiencyLabel: string;
  riskLabel: string;
  isFavorite: boolean;
  isFavoriteLoading: boolean;
  onToggleFavorite: () => void;
}) {
  const theme = useTheme();

  return (
    <>
      <InfoHintHost>
        <View className="gap-xs">
          <View className="gap-half">
            {fund.rank != null ? (
              <TextLabel variant="meta" themeColor="deepOcean">
                #{fund.rank}
              </TextLabel>
            ) : null}
            <TextParagraph variant="emphasis" numberOfLines={2}>
              {fund.name}
            </TextParagraph>
            <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
              {fund.categoryLabel}
            </TextParagraph>
          </View>
        </View>

        <View className="flex-row items-start gap-sm">
          <ScorePill score={score} />
          <InfoHintTrigger
            surface="catalog"
            term={FUND_GLOSSARY.inversoraScore.term}
            explanation={FUND_GLOSSARY.inversoraScore.explanation}
          />
        </View>

        <View className="flex-row flex-wrap items-end justify-between gap-md">
          <FundMetricBlock
            icon="tag-text-outline"
            label="Temática"
            surface="catalog"
            value={fund.themeLabel}
          />
          <View className="items-end">
            <Badge label={riskLabel} variant={getRiskBadgeVariant(fund.riskLevel)} />
          </View>
        </View>

        <Badge label={efficiencyLabel} variant={getEfficiencyBadgeVariant(score)} />
      </InfoHintHost>

      <View className="flex-row items-center justify-between gap-sm">
        <FavoriteToggleButton
          isin={fund.isin}
          isFavorite={isFavorite}
          isLoading={isFavoriteLoading}
          onToggle={onToggleFavorite}
        />
        <View className="flex-row items-center gap-xs">
          <TextLabel variant="meta" themeColor="primary">
            Ver detalle
          </TextLabel>
          <MaterialCommunityIcons name="chevron-right" size={18} color={theme.primary} />
        </View>
      </View>
    </>
  );
}

export function FundListRow(props: FundListRowProps) {
  if (props.loading) {
    return <FundListRowLoading />;
  }

  return <FundListRowLoaded fund={props.fund} onPress={props.onPress} className={props.className} />;
}

const FundListRowLoaded = memo(function FundListRowLoaded({
  fund,
  onPress,
  className,
}: FundListRowContentProps) {
  const { isFavorite, isLoading: isFavoriteLoading, toggle } = useFavorite(fund.isin);
  const score = getFundScore(fund);
  const efficiencyLabel = getEfficiencyLabel(score);
  const riskLabel = getRiskLabel(fund.riskLevel);
  const a11y = rowPressableA11y(fund, efficiencyLabel);

  const content = (
    <FundListRowContent
      fund={fund}
      score={score}
      efficiencyLabel={efficiencyLabel}
      riskLabel={riskLabel}
      isFavorite={isFavorite}
      isFavoriteLoading={isFavoriteLoading}
      onToggleFavorite={toggle}
    />
  );

  if (onPress && !isWeb) {
    return (
      <Pressable
        {...a11y}
        onPress={onPress}
        className={cn(
          'relative overflow-hidden rounded-card border border-border bg-surface active:opacity-[0.92]',
          className,
        )}
      >
        <View className="z-[1] gap-md p-lg">{content}</View>
      </Pressable>
    );
  }

  return (
    <View
      className={cn(
        'relative overflow-hidden rounded-card border border-border bg-surface',
        className,
      )}
    >
      {onPress ? (
        <Pressable
          {...a11y}
          onPress={onPress}
          className="absolute inset-0 z-0 active:opacity-[0.92]"
        />
      ) : null}

      <View pointerEvents="box-none" className="z-[1] gap-md p-lg">
        {content}
      </View>
    </View>
  );
});
