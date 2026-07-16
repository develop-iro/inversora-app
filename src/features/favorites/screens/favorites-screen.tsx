import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { MIN_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { FundListRow } from '@/features/funds/components/fund-list-row';
import { useFavoritesList } from '@/features/funds/hooks/use-favorites-list';
import { loadFavoriteCatalogFunds } from '@/features/funds/services/load-favorite-catalog-funds';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ScreenQuickAction, ScreenQuickActionsRow, TabScreenScroll } from '@/shared/components/layout';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { Button, Spinner } from '@/shared/components/ui';
import { routes } from '@/shared/navigation/routes';
import { Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const { isins, isLoading: isFavoritesLoading } = useFavoritesList();
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);

  useEffect(() => {
    if (isins.length === 0) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsCatalogLoading(true);

      try {
        const favoriteFunds = await loadFavoriteCatalogFunds(isins);

        if (cancelled) {
          return;
        }

        setFunds(favoriteFunds);
      } finally {
        if (!cancelled) {
          setIsCatalogLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isins]);

  const displayFunds = useMemo(
    () => (isins.length === 0 ? [] : funds),
    [funds, isins.length],
  );
  const isLoading = isFavoritesLoading || (isins.length > 0 && isCatalogLoading);
  const canCompareFavorites = displayFunds.length >= MIN_COMPARE_FUNDS;

  const favoriteIsins = useMemo(
    () => displayFunds.map((fund) => fund.isin),
    [displayFunds],
  );

  const handleExploreCatalog = useCallback(() => {
    router.push(routes.fundsCatalog);
  }, [router]);

  const handleCompareFavorites = useCallback(() => {
    router.push(routes.compareWithIsins(favoriteIsins));
  }, [favoriteIsins, router]);

  const handleOpenLegal = useCallback(() => {
    router.push(routes.legal);
  }, [router]);

  return (
    <TabScreenScroll
      extraBottomPadding={Spacing.xl}
      contentContainerClassName="items-center pt-xl"
      showsVerticalScrollIndicator={false}
    >
      <View
        className="w-full gap-lg"
        style={{
          maxWidth: MaxContentWidth,
          paddingHorizontal: Layout.screenPaddingHorizontal,
        }}
      >
        <View className="gap-sm">
          <TextHeading variant="section">Favoritos</TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Guarda fondos para revisarlos con calma. No constituye una recomendación
            de inversión.
          </TextParagraph>
        </View>

        {isLoading ? (
          <Spinner size="lg" accessibilityLabel="Cargando favoritos" style={{ marginVertical: Spacing.lg }} />
        ) : isins.length === 0 ? (
          <View className="gap-sm py-md">
            <TextParagraph variant="emphasis">Aún no tienes favoritos</TextParagraph>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Abre un fondo en el catálogo y pulsa «Guardar en favoritos» para verlo
              aquí.
            </TextParagraph>
            <Button
              label="Explorar catálogo"
              variant="secondary"
              onPress={handleExploreCatalog}
              accessibilityLabel="Explorar catálogo de fondos"
              className="self-start"
            />
          </View>
        ) : displayFunds.length === 0 ? (
          <View className="gap-sm py-md">
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Tus favoritos guardados ya no están disponibles en el catálogo actual.
            </TextParagraph>
            <Button
              label="Explorar catálogo"
              variant="secondary"
              onPress={handleExploreCatalog}
              accessibilityLabel="Explorar catálogo de fondos"
              className="self-start"
            />
          </View>
        ) : (
          <>
            {canCompareFavorites ? (
              <ScreenQuickActionsRow>
                <ScreenQuickAction
                  icon="scale-balance"
                  label="Comparar favoritos"
                  accessibilityLabel="Comparar fondos favoritos seleccionados"
                  variant="accent"
                  onPress={handleCompareFavorites}
                />
                <ScreenQuickAction
                  icon="magnify"
                  label="Explorar catálogo"
                  accessibilityLabel="Explorar catálogo de fondos"
                  onPress={handleExploreCatalog}
                />
              </ScreenQuickActionsRow>
            ) : (
              <TextParagraph variant="secondary" themeColor="textSecondary">
                Añade al menos otro favorito para compararlos lado a lado.
              </TextParagraph>
            )}

            <View className="gap-md">
              {displayFunds.map((fund) => (
                <FundListRow
                  key={fund.isin}
                  fund={fund}
                  onPress={() => router.push(routes.fundDetail(fund.isin))}
                />
              ))}
            </View>
          </>
        )}

        <LegalNotice
          body="Los favoritos son una herramienta de seguimiento educativo. Inversora no ofrece asesoramiento financiero personalizado."
          onLearnMorePress={handleOpenLegal}
        />
      </View>
    </TabScreenScroll>
  );
}
