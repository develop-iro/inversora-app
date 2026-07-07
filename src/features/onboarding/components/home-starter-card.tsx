import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type HomeStarterCardProps = {
  title: string;
  iconName: ComponentProps<typeof MaterialCommunityIcons>['name'];
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress?: () => void;
};

/**
 * Compact entry card for the minimal home "Para empezar" section.
 * Solid brand teal surface with white typography (promotional / educational).
 */
export function HomeStarterCard({
  title,
  iconName,
  accessibilityLabel,
  accessibilityHint,
  onPress,
}: HomeStarterCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? theme.deepOcean : theme.primary },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.onPrimarySurface }]}>
        <MaterialCommunityIcons name={iconName} size={18} color={theme.textOnPrimary} />
      </View>
      <TextParagraph variant="emphasis" themeColor="textOnPrimary" style={styles.title}>
        {title}
      </TextParagraph>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: 88,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    lineHeight: 22,
  },
});
