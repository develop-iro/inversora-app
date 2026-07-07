import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { HeaderSection } from '@/shared/components/headers/header-section';
import { InfoHintTrigger } from '@/shared/components/ui';
import { Spacing } from '@/shared/theme/theme';

export type FundDetailSectionShellProps = {
  title: string;
  subtitle?: string;
  hintTerm?: string;
  hintExplanation?: string;
  children: ReactNode;
};

/**
 * Shared section wrapper for fund detail blocks: {@link HeaderSection} + body slot.
 */
export function FundDetailSectionShell({
  title,
  subtitle,
  hintTerm,
  hintExplanation,
  children,
}: FundDetailSectionShellProps) {
  return (
    <View style={styles.section}>
      <HeaderSection
        title={title}
        summary={subtitle}
        variant="compact"
        style={styles.header}
        action={
          hintTerm && hintExplanation ? (
            <InfoHintTrigger
              surface="detail"
              term={hintTerm}
              explanation={hintExplanation}
            />
          ) : undefined
        }
      />
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignSelf: 'stretch',
    gap: Spacing.sm,
  },
  header: {
    paddingBottom: 0,
  },
  body: {
    gap: Spacing.md,
  },
});
