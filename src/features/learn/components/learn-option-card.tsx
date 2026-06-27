import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { LearnQuestionOption } from '@/features/learn/constants/learn-questionnaire';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type LearnOptionCardProps = {
  option: LearnQuestionOption;
  selected: boolean;
  onSelect: (optionId: string) => void;
};

/**
 * Tappable answer card for a single-choice profiling step.
 */
export function LearnOptionCard({ option, selected, onSelect }: LearnOptionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={option.description ? `${option.label}. ${option.description}` : option.label}
      onPress={() => onSelect(option.id)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected ? 'rgba(0, 191, 166, 0.08)' : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.header}>
        {option.icon ? (
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: selected
                  ? 'rgba(0, 191, 166, 0.14)'
                  : theme.backgroundSoft,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={option.icon}
              size={18}
              color={selected ? theme.primary : theme.textSecondary}
            />
          </View>
        ) : null}
        <ThemedText type="bodyBold" style={styles.label}>
          {option.label}
        </ThemedText>
      </View>
      {option.description ? (
        <ThemedText type="caption" themeColor="textSecondary" style={styles.description}>
          {option.description}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  cardPressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
  description: {
    lineHeight: 18,
    paddingLeft: 40,
  },
});
