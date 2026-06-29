import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { InversoraBrandMark } from '@/shared/components/brand/inversora-brand-mark';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { Layout, Radius, Spacing, Typography } from '@/shared/theme/theme';

const brandSerif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, Times New Roman, serif',
  default: 'serif',
});

const COMPACT_HEADER_WIDTH = 400;

/**
 * Horizontal inset that aligns header content with the centered page column on wide screens.
 */
export function useHeaderHorizontalInset() {
  const { contentWidth, windowWidth } = useMobileLayout();

  return Math.max(
    Layout.screenPaddingHorizontal,
    (windowWidth - contentWidth) / 2 + Layout.screenPaddingHorizontal,
  );
}

/**
 * Left-aligned brand cluster for the app header.
 */
export function AppHeaderBrand() {
  const theme = useTheme();
  const { windowWidth, isMobile } = useMobileLayout();
  const isCompact = windowWidth < COMPACT_HEADER_WIDTH;

  return (
    <View style={styles.brandBar}>
      <InversoraBrandMark size={isCompact ? 32 : 36} />

      <View style={styles.brandText}>
        <Text style={[styles.wordmark, isCompact && styles.wordmarkCompact]} accessibilityRole="header">
          Inversora
        </Text>
        {!isMobile ? (
          <Text style={[styles.eyebrow, { color: theme.textSecondary }]} numberOfLines={1}>
            Educación financiera
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/**
 * Right-aligned educational action for the app header.
 */
export function AppHeaderLearnAction() {
  const router = useRouter();
  const theme = useTheme();
  const { windowWidth } = useMobileLayout();
  const isCompact = windowWidth < COMPACT_HEADER_WIDTH;

  const handleLearnPress = () => {
    router.push(routes.learn);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir guía educativa"
      accessibilityHint="Inicia el cuestionario para aprender sobre fondos indexados"
      onPress={handleLearnPress}
      style={({ pressed }) => [
        isCompact ? styles.actionIconButton : styles.actionChip,
        {
          backgroundColor: isCompact ? 'rgba(0, 191, 166, 0.12)' : 'rgba(0, 191, 166, 0.1)',
          borderColor: isCompact ? 'rgba(0, 191, 166, 0.24)' : 'rgba(0, 191, 166, 0.22)',
        },
        pressed && styles.actionPressed,
      ]}
    >
      <MaterialCommunityIcons
        name="book-open-page-variant-outline"
        size={isCompact ? 18 : 15}
        color={theme.deepOcean}
      />
      {!isCompact ? (
        <Text style={[styles.actionLabel, { color: theme.deepOcean }]}>Aprender</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
  },
  brandText: {
    flexShrink: 0,
    gap: 1,
  },
  wordmark: {
    color: '#0B2E36',
    fontFamily: brandSerif,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  wordmarkCompact: {
    fontSize: 22,
    lineHeight: 26,
  },
  eyebrow: {
    fontFamily: Typography.metaLabel.fontFamily,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.48,
    textTransform: 'uppercase',
  },
  actionChip: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    flexShrink: 0,
  },
  actionIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    flexShrink: 0,
  },
  actionPressed: {
    opacity: 0.88,
  },
  actionLabel: {
    fontFamily: Typography.chip.fontFamily,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: -0.1,
  },
});
