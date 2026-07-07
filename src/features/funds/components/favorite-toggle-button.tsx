import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FavoriteToggleButtonProps = {
  isin: string;
  isFavorite: boolean;
  isLoading?: boolean;
  onToggle: () => void;
};

export function FavoriteToggleButton({
  isin,
  isFavorite,
  isLoading = false,
  onToggle,
}: FavoriteToggleButtonProps) {
  const theme = useTheme();
  const label = isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${isin}`}
      accessibilityState={{ selected: isFavorite, disabled: isLoading }}
      disabled={isLoading}
      hitSlop={8}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isFavorite ? theme.primarySurface : theme.surfaceMuted,
          borderColor: isFavorite ? theme.primary : theme.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={20}
        color={isFavorite ? theme.primary : theme.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
});
