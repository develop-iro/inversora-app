import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CatalogFund } from '@/core/domain/catalog';
import { FundListRow } from '@/features/funds/components/fund-list-row';
import { useFavoritesList } from '@/features/funds/hooks/use-favorites-list';
import { getFunds } from '@/features/funds/services/get-funds';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
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
      const catalog = await getFunds();
      if (cancelled) {
        return;
      }

      const favoriteSet = new Set(isins);
      setFunds(catalog.filter((fund) => favoriteSet.has(fund.isin)));
      setIsCatalogLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isins]);

  const displayFunds = isins.length === 0 ? [] : funds;
  const isLoading = isFavoritesLoading || (isins.length > 0 && isCatalogLoading);

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
          <ThemedText type="sectionTitle">Favoritos</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            Guarda fondos para revisarlos con calma. No constituye una recomendación
            de inversión.
          </ThemedText>
        </View>

        {isLoading ? (
          <ActivityIndicator color={theme.primary} style={styles.loader} />
        ) : isins.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText type="bodyBold">Aún no tienes favoritos</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Abre un fondo en el catálogo y pulsa «Guardar en favoritos» para verlo
              aquí.
            </ThemedText>
          </View>
        ) : displayFunds.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText type="caption" themeColor="textSecondary">
              Tus favoritos guardados ya no están en el catálogo mock.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {displayFunds.map((fund) => (
              <FundListRow
                key={fund.isin}
                fund={fund}
                onPress={() => router.push(routes.fundDetail(fund.isin))}
              />
            ))}
          </View>
        )}

        <LegalNotice body="Los favoritos son una herramienta de seguimiento educativo. Invesora no ofrece asesoramiento financiero personalizado." />
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
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
});
