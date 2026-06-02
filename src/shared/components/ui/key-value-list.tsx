import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Divider } from '@/shared/components/ui/divider';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

export type KeyValueRow = {
  id: string;
  label: string;
  value: string;
  emphasis?: 'link';
};

export type KeyValueListProps = {
  rows: KeyValueRow[];
};

export function KeyValueList({ rows }: KeyValueListProps) {
  const theme = useTheme();

  return (
    <View style={styles.list}>
      {rows.map((row, index) => (
        <View key={row.id}>
          <View style={styles.row}>
            <ThemedText type="body" style={styles.label} numberOfLines={2}>
              {row.label}
            </ThemedText>
            <ThemedText
              type="bodyBold"
              style={[
                styles.value,
                row.emphasis === 'link' && { color: theme.primary },
              ]}
              numberOfLines={3}
            >
              {row.value}
            </ThemedText>
          </View>
          {index < rows.length - 1 ? (
            <Divider spacing={0} style={styles.divider} />
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  label: {
    flex: 1,
    minWidth: 0,
  },
  value: {
    flexShrink: 0,
    maxWidth: '52%',
    textAlign: 'right',
  },
  divider: {
    marginVertical: 0,
  },
});
