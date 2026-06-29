import { Linking, StyleSheet, View } from 'react-native';

import type { InvestmentNewsItem } from '@/core/domain/investment-news';
import { HomeNewsCard } from '@/features/onboarding/components/home-news-card';
import { HomeSectionHeader } from '@/features/onboarding/components/home-section-header';
import { HomeNewsSkeleton } from '@/features/onboarding/components/skeletons/home-news-skeleton';
import type { HomeSectionLoadState } from '@/features/onboarding/hooks/use-home-screen-data';
import { ContentEmptyState } from '@/shared/components/ui/content-empty-state';
import { Layout, Spacing } from '@/shared/theme/theme';

export type HomeNewsSectionProps = {
  items: readonly InvestmentNewsItem[];
  loadState: HomeSectionLoadState;
  onRetry?: () => void;
};

/**
 * Educational investment news block at the bottom of the home screen.
 */
export function HomeNewsSection({ items, loadState, onRetry }: HomeNewsSectionProps) {
  const handleNewsPress = (item: InvestmentNewsItem) => {
    if (!item.url) {
      return;
    }

    void Linking.openURL(item.url);
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <HomeSectionHeader
          title="Noticias de inversión"
          summary="Contexto educativo y novedades del entorno. No son recomendaciones de compra o venta."
        />
      </View>

      {loadState === 'loading' ? (
        <HomeNewsSkeleton cards={3} />
      ) : loadState === 'error' ? (
        <ContentEmptyState
          icon="newspaper-variant-outline"
          title="No hemos podido cargar las noticias"
          message="Revisa tu conexión o vuelve a intentarlo. El contexto educativo volverá en cuanto esté disponible."
          actionLabel="Reintentar"
          onAction={onRetry}
          style={styles.emptyCard}
        />
      ) : items.length > 0 ? (
        <View style={styles.list}>
          {items.map((item) => (
            <HomeNewsCard key={item.id} item={item} onPress={handleNewsPress} />
          ))}
        </View>
      ) : (
        <ContentEmptyState
          icon="text-box-outline"
          title="Sin noticias por ahora"
          message="Cuando haya novedades educativas del entorno, las verás aquí con contexto y sin prisa."
          actionLabel="Actualizar"
          onAction={onRetry}
          style={styles.emptyCard}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  header: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  list: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.md,
  },
  emptyCard: {
    marginHorizontal: Layout.screenPaddingHorizontal,
  },
});
