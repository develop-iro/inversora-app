import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHero } from '@/features/onboarding/components/home-hero';
import { FundCardIcon } from '@/features/onboarding/components/fund-card-icon';
import { ThemedText } from '@/shared/components/themed-text';
import {
  Badge,
  InvestmentCard,
  MediaCard,
  SearchField,
  SectionHeader,
} from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { BottomTabInset, Layout, Spacing } from '@/shared/theme/theme';

const FEATURED_FUNDS = [
  { id: 'savings', title: 'Ahorros', subtitle: '$0.00', icon: '↗' },
  {
    id: 'eafe',
    title: 'iShares MSCI EAFE',
    subtitle: 'Comisión anual: 0.32%',
    icon: '+',
  },
  {
    id: 'fidelity',
    title: 'Fidelity ZERO Total Market',
    subtitle: 'Comisión anual: 0.00%',
    icon: '↓',
  },
  {
    id: 'schwab',
    title: 'Schwab U.S. Large-Cap',
    subtitle: 'Comisión anual: 0.03%',
    icon: '+',
  },
] as const;

const RECENT_FUNDS = [
  {
    id: 'blue',
    title: 'Fondo Azul Estable',
    subtitle: 'ISIN: ES9876543210',
    placeholderColor: '#B8F2E6',
  },
  {
    id: 'mixed',
    title: 'Fondo Mixto Conservador',
    subtitle: 'ISIN: ES1122334455',
    placeholderColor: '#EAF8F6',
  },
  {
    id: 'yellow',
    title: 'Fondo Amarillo Innovador',
    subtitle: 'ISIN: ES1928374650',
    placeholderColor: '#D7FF64',
  },
] as const;

const FUND_BADGES = [
  '1 año',
  'Riesgo: Bajo',
  '5 años',
  'Más información',
  'Gastos: 0.5%',
  'Gestora: Invesora',
  'Categoría: Mixto',
] as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth, featuredCardWidth } = useMobileLayout();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            width: contentWidth,
            maxWidth: contentWidth,
            paddingBottom: BottomTabInset + Spacing.xl + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.navBar, { paddingTop: insets.top, backgroundColor: theme.surface }]}>
          <ThemedText type="navTitle" style={styles.navTitle}>
            Invesora
          </ThemedText>
        </View>

        <HomeHero />

        <View style={[styles.contentPanel, { backgroundColor: theme.surface }]}>
          <SectionHeader title="Fondos destacados" />

          <View style={styles.featuredGrid}>
            {FEATURED_FUNDS.map((fund) => (
              <InvestmentCard
                key={fund.id}
                style={{ width: featuredCardWidth }}
                icon={<FundCardIcon symbol={fund.icon} />}
                title={fund.title}
                subtitle={fund.subtitle}
              />
            ))}
          </View>

          <View style={styles.searchWrapper}>
            <SearchField
              placeholder="Buscar fondos"
              leadingIcon={
                <Text style={[styles.searchIcon, { color: theme.textSecondary }]}>⌕</Text>
              }
            />
          </View>

          <SectionHeader title="Recién vistos" />

          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}>
            {RECENT_FUNDS.map((fund) => (
              <MediaCard
                key={fund.id}
                title={fund.title}
                subtitle={fund.subtitle}
                imageHeight={173}
                style={styles.carouselCard}
                imageSlot={
                  <View
                    style={[styles.mediaPlaceholder, { backgroundColor: fund.placeholderColor }]}
                  />
                }
              />
            ))}
          </ScrollView>

          <View style={styles.badgesSection}>
            {FUND_BADGES.map((label) => (
              <Badge key={label} label={label} variant="soft" />
            ))}
          </View>

          <ThemedText type="sectionTitle" style={styles.fundDescriptionTitle}>
            Descripción del fondo
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  navBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.sm,
    minHeight: 44,
  },
  navTitle: {
    textAlign: 'center',
  },
  contentPanel: {
    alignSelf: 'stretch',
    paddingBottom: Spacing.lg,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.lg,
    rowGap: Spacing.lg,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  searchWrapper: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
    lineHeight: 18,
  },
  carousel: {
    flexGrow: 0,
  },
  carouselContent: {
    gap: Spacing.sm,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: Spacing.sm,
  },
  carouselCard: {
    flexShrink: 0,
  },
  mediaPlaceholder: {
    flex: 1,
    width: '100%',
  },
  badgesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
    alignItems: 'flex-start',
  },
  fundDescriptionTitle: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});
