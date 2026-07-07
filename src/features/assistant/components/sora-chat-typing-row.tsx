import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

/**
 * Inline loading row shown while SORA is generating a response.
 */
export function SoraChatTypingRow() {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="SORA está escribiendo una respuesta"
      style={[
        styles.row,
        {
          backgroundColor: theme.softTealSurfaceMuted,
          borderColor: theme.primaryBorderFaint,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.primaryIconSurface }]}>
        <MaterialCommunityIcons name="creation" size={14} color={theme.deepOcean} />
      </View>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        SORA está pensando…
      </TextParagraph>
      <ActivityIndicator size="small" color={theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: '88%',
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
