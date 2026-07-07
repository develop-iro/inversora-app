import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import type { AllocationSlice } from '@/core/domain/fund-detail-profile';
import { TextParagraph } from '@/shared/components/text';
import { Divider } from '@/shared/components/ui/divider';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type AllocationBarListProps = {
  slices: AllocationSlice[];
  barColor?: string;
};

export function AllocationBarList({ slices, barColor }: AllocationBarListProps) {
  const theme = useTheme();
  const fillColor = barColor ?? theme.chartAllocationFill;

  return (
    <View style={styles.list}>
      {slices.map((slice, index) => (
        <View key={`${slice.label}-${index}`}>
          <View style={styles.row}>
            {slice.icon ? (
              <MaterialCommunityIcons
                name={slice.icon as IconName}
                size={20}
                color={theme.primary}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            ) : (
              <View style={styles.iconPlaceholder} />
            )}
            <TextParagraph variant="default" style={styles.label} numberOfLines={1}>
              {slice.label}
            </TextParagraph>
            <TextParagraph variant="emphasis" style={styles.percent}>
              {slice.percent.toFixed(1).replace('.', ',')}%
            </TextParagraph>
          </View>
          <View
            style={[styles.track, { backgroundColor: theme.surfaceMuted }]}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: slice.percent }}
          >
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: fillColor,
                  width: `${Math.min(100, Math.max(4, slice.percent))}%`,
                },
              ]}
            />
          </View>
          {index < slices.length - 1 ? (
            <Divider spacing={Spacing.sm} style={styles.divider} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  iconPlaceholder: {
    width: 20,
  },
  label: {
    flex: 1,
    minWidth: 0,
  },
  percent: {
    minWidth: 48,
    textAlign: 'right',
  },
  track: {
    height: 8,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  divider: {
    marginVertical: 0,
  },
});
