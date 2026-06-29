import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CompareCollapsibleSectionProps = {
  title: string;
  subtitle?: string;
  defaultExpanded?: boolean;
  children: ReactNode;
};

/**
 * Progressive-disclosure wrapper for comparison blocks on narrow screens.
 */
export function CompareCollapsibleSection({
  title,
  subtitle,
  defaultExpanded = false,
  children,
}: CompareCollapsibleSectionProps) {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View
      style={[
        styles.section,
        { borderColor: theme.border, backgroundColor: theme.surface },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${title}. ${isExpanded ? 'Contraer' : 'Expandir'} sección`}
        onPress={() => setIsExpanded((current) => !current)}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
      >
        <View style={styles.headerCopy}>
          <ThemedText type="bodyBold">{title}</ThemedText>
          {subtitle ? (
            <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={theme.textSecondary}
        />
      </Pressable>

      {isExpanded ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  headerPressed: {
    opacity: 0.9,
  },
  headerCopy: {
    flex: 1,
    gap: Spacing.xs,
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
});
