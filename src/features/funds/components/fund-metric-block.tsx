import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { InfoHintTrigger } from '@/shared/components/ui/info-hint';
import type { InfoHintSurface } from '@/shared/platform/capabilities';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

export type FundMetricBlockProps = {
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  hintTerm?: string;
  hintExplanation?: string;
  surface?: InfoHintSurface;
  value: ReactNode;
};

export function FundMetricBlock({
  icon,
  label,
  hintTerm,
  hintExplanation,
  surface = 'catalog',
  value,
}: FundMetricBlockProps) {
  const theme = useTheme();
  const showHint = hintTerm != null && hintExplanation != null;

  return (
    <View style={styles.block}>
      <View style={styles.labelRow}>
        {icon ? (
          <MaterialCommunityIcons name={icon} size={16} color={theme.deepOcean} />
        ) : null}
        <View style={styles.textBlock}>
          <View style={styles.metaRow}>
            <TextLabel variant="meta" themeColor="textSecondary">
              {label}
            </TextLabel>
            {showHint ? (
              <InfoHintTrigger
                term={hintTerm}
                explanation={hintExplanation}
                surface={surface}
              />
            ) : null}
          </View>
          {typeof value === 'string' || typeof value === 'number' ? (
            <TextParagraph variant="emphasis" style={styles.metricValue}>
              {value}
            </TextParagraph>
          ) : (
            value
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xs,
    minWidth: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  metricValue: {
    lineHeight: 22,
  },
});
