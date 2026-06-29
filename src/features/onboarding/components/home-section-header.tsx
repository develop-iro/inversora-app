import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Spacing } from '@/shared/theme/theme';

export type HomeSectionHeaderProps = {
  title: string;
  summary?: string;
};

/**
 * Shared title block for minimal home sections.
 */
export function HomeSectionHeader({ title, summary }: HomeSectionHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText type="sectionTitle" style={styles.title}>
        {title}
      </ThemedText>
      {summary ? (
        <ThemedText type="caption" themeColor="textSecondary" style={styles.summary}>
          {summary}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.sm,
  },
  title: {
    letterSpacing: -0.2,
  },
  summary: {
    maxWidth: 620,
    lineHeight: 22,
  },
});
