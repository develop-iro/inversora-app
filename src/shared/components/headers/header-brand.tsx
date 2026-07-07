import { StyleSheet, Text, View } from 'react-native';

import { InversoraBrandMark } from '@/shared/components/brand/inversora-brand-mark';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { Size, Spacing, Typography } from '@/shared/theme/theme';

const COMPACT_HEADER_WIDTH = 400;

/**
 * Brand cluster for dashboard (`HeaderApp`) surfaces.
 */
export function HeaderBrand() {
  const theme = useTheme();
  const { windowWidth, isMobile } = useMobileLayout();
  const isCompact = windowWidth < COMPACT_HEADER_WIDTH;

  return (
    <View style={styles.brandBar}>
      <InversoraBrandMark size={isCompact ? Size.iconLg : Size.iconBrand} />

      <View style={styles.brandText}>
        <Text
          style={[styles.wordmark, { color: theme.deepOcean }, isCompact && styles.wordmarkCompact]}
          accessibilityRole="header"
        >
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

const styles = StyleSheet.create({
  brandBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
  },
  brandText: {
    flexShrink: 0,
    gap: Spacing['2xs'],
  },
  wordmark: {
    ...Typography.brandWordmark,
  },
  wordmarkCompact: {
    ...Typography.brandWordmarkCompact,
  },
  eyebrow: {
    ...Typography.micro,
  },
});
