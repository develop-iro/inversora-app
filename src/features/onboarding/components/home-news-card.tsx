import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import type { InvestmentNewsCategory, InvestmentNewsItem } from '@/core/domain/investment-news';
import { canOpenInvestmentNewsItem } from '@/features/onboarding/services/resolve-investment-news-press';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { SkeletonBone, SkeletonShimmerProvider } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import type { WithLoading } from '@/shared/types/component-loading';

type HomeNewsCardContentProps = {
  item: InvestmentNewsItem;
  onPress?: (item: InvestmentNewsItem) => void;
};

export type HomeNewsCardProps = WithLoading<HomeNewsCardContentProps>;

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

function HomeNewsCardLoading() {
  return (
    <SkeletonShimmerProvider>
      <View
        className="gap-sm rounded-card border border-border bg-surface-muted px-md py-md"
        accessibilityLabel="Cargando noticia"
      >
        <View className="flex-row items-center justify-between gap-sm">
          <SkeletonBone width={72} height={22} borderRadius={9999} />
          <SkeletonBone width={56} height={12} />
        </View>

        <SkeletonBone width="88%" height={18} />
        <SkeletonBone width="100%" height={12} />
        <SkeletonBone width="92%" height={12} />
        <SkeletonBone width="34%" height={12} />
      </View>
    </SkeletonShimmerProvider>
  );
}

/**
 * Compact news row for the home investment news section.
 */
export function HomeNewsCard(props: HomeNewsCardProps) {
  if (props.loading) {
    return <HomeNewsCardLoading />;
  }

  return <HomeNewsCardContent item={props.item} onPress={props.onPress} />;
}

function HomeNewsCardContent({ item, onPress }: HomeNewsCardContentProps) {
  const theme = useTheme();
  const categoryLabel = CATEGORY_LABELS[item.category];
  const isOpenable = canOpenInvestmentNewsItem(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.summary}`}
      accessibilityHint={
        isOpenable ? 'Abre la fuente de la noticia' : 'Noticia informativa educativa'
      }
      onPress={() => {
        onPress?.(item);
      }}
      className="gap-sm rounded-card border border-border bg-surface-muted px-md py-md active:opacity-90"
    >
      <View className="flex-row items-center justify-between gap-sm">
        <View className="rounded-full bg-background-soft px-sm py-xs">
          <TextLabel variant="meta" themeColor="primary" className="text-micro tracking-[0.6px]">
            {categoryLabel}
          </TextLabel>
        </View>

        <TextParagraph variant="secondary" themeColor="textSecondary">
          {formatPublishedDate(item.publishedAt)}
        </TextParagraph>
      </View>

      <TextParagraph variant="emphasis" className="leading-[22px]">
        {item.title}
      </TextParagraph>
      <TextParagraph variant="secondary" themeColor="textSecondary" className="leading-[19px]">
        {item.summary}
      </TextParagraph>

      <View className="flex-row items-center justify-between gap-sm">
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {item.source}
        </TextParagraph>
        {isOpenable ? (
          <MaterialCommunityIcons name="open-in-new" size={14} color={theme.primary} />
        ) : null}
      </View>
    </Pressable>
  );
}
