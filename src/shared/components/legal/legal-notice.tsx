import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type LegalNoticeProps = {
  title?: string;
  body: string;
  style?: StyleProp<ViewStyle>;
};

export function LegalNotice({
  title = 'Información educativa',
  body,
  style,
}: LegalNoticeProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${body}`}
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="information-outline"
          size={14}
          color={theme.textSecondary}
        />
        <ThemedText type="caption" themeColor="textSecondary" style={styles.title}>
          {title}
        </ThemedText>
      </View>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.body}>
        {body}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    fontSize: 12,
    lineHeight: 17,
  },
  body: {
    fontSize: 12,
    lineHeight: 17,
  },
});
