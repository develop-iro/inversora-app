import { useRouter } from 'expo-router';
import { View, Alert } from 'react-native';

import type { InvestmentNewsItem } from '@/core/domain/investment-news';
import { openSafeExternalUrl } from '@/core/security/open-safe-external-url';
import { HomeNewsCard } from '@/features/onboarding/components/home-news-card';
import { HomeSectionCard } from '@/features/onboarding/components/home-section-card';
import type { HomeSectionLoadState } from '@/features/onboarding/hooks/use-home-screen-data';
import { resolveInvestmentNewsPressAction } from '@/features/onboarding/services/resolve-investment-news-press';
import { ContentEmptyState, ReloadState } from '@/shared/components/ui';

export type HomeNewsSectionProps = {
  items: readonly InvestmentNewsItem[];
  loadState: HomeSectionLoadState;
  onRetry?: () => void;
};

/**
 * Educational investment news block at the bottom of the home screen.
 */
export function HomeNewsSection({ items, loadState, onRetry }: HomeNewsSectionProps) {
  const router = useRouter();

  const handleNewsPress = (item: InvestmentNewsItem) => {
    const action = resolveInvestmentNewsPressAction(item);

    if (!action) {
      return;
    }

    if (action.kind === 'internal') {
      router.push(action.href);
      return;
    }

    void openSafeExternalUrl(action.url).then((opened: boolean) => {
      if (!opened) {
        Alert.alert(
          'Enlace no disponible',
          'No pudimos abrir la fuente de la noticia. Inténtalo de nuevo más tarde.',
        );
      }
    });
  };

  return (
    <HomeSectionCard
      title="Noticias de inversión"
      summary="Contexto educativo y novedades del entorno. No son recomendaciones de compra o venta."
    >
      {loadState === 'loading' ? (
        <View className="gap-md" accessibilityLabel="Cargando noticias">
          {Array.from({ length: 3 }, (_, index) => (
            <HomeNewsCard key={`news-loading-${index}`} loading />
          ))}
        </View>
      ) : loadState === 'error' ? (
        <ReloadState
          title="No hemos podido cargar las noticias"
          message="Revisa tu conexión o vuelve a intentarlo. El contexto educativo volverá en cuanto esté disponible."
          onAction={onRetry}
        />
      ) : items.length > 0 ? (
        <View className="gap-md">
          {items.map((item) => (
            <HomeNewsCard key={item.id} item={item} onPress={handleNewsPress} />
          ))}
        </View>
      ) : (
        <ContentEmptyState
          title="Sin noticias por ahora"
          message="Cuando haya novedades educativas del entorno, las verás aquí con contexto y sin prisa."
          actionLabel="Actualizar"
          onAction={onRetry}
        />
      )}
    </HomeSectionCard>
  );
}
