import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { FavoriteToggleButton } from '@/features/funds/components/favorite-toggle-button';
import { FundMetricBlock } from '@/features/funds/components/fund-metric-block';
import { useFavorite } from '@/features/funds/hooks/use-favorite';
import {
  buildFundCardA11yLabel,
  getFundScore,
} from '@/features/funds/utils/fund-summary';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { ThemedText } from '@/shared/components/themed-text';
import { Badge, InfoHintTrigger, ScorePill } from '@/shared/components/ui';
import { InfoHintHost } from '@/shared/components/ui/info-hint-host';
import { useTheme } from '@/shared/hooks/use-theme';
import { isWeb } from '@/shared/platform/capabilities';
import { getEfficiencyBadgeVariant, getEfficiencyLabel } from '@/shared/utils/fund-efficiency';
import { getRiskBadgeVariant, getRiskLabel } from '@/shared/utils/fund-risk';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundListRowProps = {
  fund: CatalogFund;
  onPress?: () => void;
};

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
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            {fund.rank != null ? (
              <ThemedText type="metaLabel" themeColor="deepOcean">
                #{fund.rank}
              </ThemedText>
            ) : null}
            <ThemedText type="bodyBold" numberOfLines={2}>
              {fund.name}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
              {fund.categoryLabel}
            </ThemedText>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <ScorePill score={score} />
          <InfoHintTrigger
            surface="catalog"
            term={FUND_GLOSSARY.inversoraScore.term}
            explanation={FUND_GLOSSARY.inversoraScore.explanation}
          />
        </View>

        <View style={styles.metricsRow}>
          <FundMetricBlock
            icon="tag-text-outline"
            label="Temática"
            surface="catalog"
            value={fund.themeLabel}
          />
          <View style={styles.riskBadgeWrap}>
            <Badge label={riskLabel} variant={getRiskBadgeVariant(fund.riskLevel)} />
          </View>
        </View>

        <Badge label={efficiencyLabel} variant={getEfficiencyBadgeVariant(score)} />
      </InfoHintHost>

      <View style={styles.footer}>
        <FavoriteToggleButton
          isin={fund.isin}
          isFavorite={isFavorite}
          isLoading={isFavoriteLoading}
          onToggle={onToggleFavorite}
        />
        <View style={styles.detailCue}>
          <ThemedText type="metaLabel" style={{ color: theme.primary }}>
            Ver detalle
          </ThemedText>
          <MaterialCommunityIcons name="chevron-right" size={18} color={theme.primary} />
        </View>
      </View>
    </>
  );
}

/** Compact list card aligned with FundCard design tokens. */
export function FundListRow({ fund, onPress }: FundListRowProps) {
  const theme = useTheme();
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
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.content}>{content}</View>
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      {onPress ? (
        <Pressable
          {...a11y}
          onPress={onPress}
          style={({ pressed }) => [styles.detailHitArea, pressed && styles.pressed]}
        />
      ) : null}

      <View pointerEvents="box-none" style={styles.content}>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  detailHitArea: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  pressed: {
    opacity: 0.92,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
    zIndex: 1,
  },
  header: {
    gap: Spacing.xs,
  },
  titleBlock: {
    gap: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  riskBadgeWrap: {
    alignItems: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  detailCue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
