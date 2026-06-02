import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { InfoHintTrigger } from '@/shared/components/ui';
import { Spacing } from '@/shared/theme/theme';

export type FundDetailSectionShellProps = {
  title: string;
  subtitle?: string;
  hintTerm?: string;
  hintExplanation?: string;
  children: ReactNode;
};

export function FundDetailSectionShell({
  title,
  subtitle,
  hintTerm,
  hintExplanation,
  children,
}: FundDetailSectionShellProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText type="sectionTitle" accessibilityRole="header">
            {title}
          </ThemedText>
          {hintTerm && hintExplanation ? (
            <InfoHintTrigger
              surface="detail"
              term={hintTerm}
              explanation={hintExplanation}
            />
          ) : null}
        </View>
        {subtitle ? (
          <ThemedText type="caption" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
    alignSelf: 'stretch',
  },
  header: {
    gap: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
});
