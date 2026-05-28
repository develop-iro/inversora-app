import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Spacing } from '@/shared/theme/theme';

export type SectionHeaderProps = ViewProps & {
  title: string;
  action?: ReactNode;
};

/** Figma: Table Title Emphasized — título de sección con padding horizontal. */
export function SectionHeader({ title, action, style, ...viewProps }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]} {...viewProps}>
      <ThemedText type="sectionTitle" style={styles.title}>
        {title}
      </ThemedText>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'stretch',
  },
  title: {
    flex: 1,
  },
});
