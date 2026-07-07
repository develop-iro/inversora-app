import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CatalogFund } from '@/core/domain/catalog';
import { MIN_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { FundListRow } from '@/features/funds/components/fund-list-row';
import { useFavoritesList } from '@/features/funds/hooks/use-favorites-list';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';
import { mapFundDetailToCatalogFund } from '@/features/funds/utils/map-fund-detail-to-catalog';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ScreenQuickAction, ScreenQuickActionsRow } from '@/shared/components/layout';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { Button, Spinner } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { BottomTabInset, Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
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
        const details = await Promise.all(
          isins.map(async (isin) => {
            try {
              return await getFundByIsin(isin);
            } catch {
              return null;
            }
          }),
        );

        if (cancelled) {
          return;
        }

        const favoriteFunds = details
          .filter((detail) => detail !== null)
          .map((detail) => mapFundDetailToCatalogFund(detail));

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
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + BottomTabInset + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <View style={styles.headerBlock}>
          <TextHeading variant="section">Favoritos</TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Guarda fondos para revisarlos con calma. No constituye una recomendación
            de inversión.
          </TextParagraph>
        </View>

        {isLoading ? (
          <Spinner size="lg" accessibilityLabel="Cargando favoritos" style={styles.loader} />
        ) : isins.length === 0 ? (
          <View style={styles.empty}>
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
              style={styles.emptyAction}
            />
          </View>
        ) : displayFunds.length === 0 ? (
          <View style={styles.empty}>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Tus favoritos guardados ya no están disponibles en el catálogo actual.
            </TextParagraph>
            <Button
              label="Explorar catálogo"
              variant="secondary"
              onPress={handleExploreCatalog}
              accessibilityLabel="Explorar catálogo de fondos"
              style={styles.emptyAction}
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

            <View style={styles.list}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.lg,
  },
  headerBlock: {
    gap: Spacing.sm,
  },
  loader: {
    marginVertical: Spacing.lg,
  },
  empty: {
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  emptyAction: {
    alignSelf: 'flex-start',
  },
  list: {
    gap: Spacing.md,
  },
});
