import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
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
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: 'rgba(0, 191, 166, 0.1)' },
        ]}
      >
        <MaterialCommunityIcons name={iconName} size={18} color={theme.deepOcean} />
      </View>
      <ThemedText type="bodyBold" style={styles.title}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 88,
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  cardPressed: {
    opacity: 0.88,
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
