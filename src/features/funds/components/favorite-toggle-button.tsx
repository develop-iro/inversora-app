import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type FavoriteToggleButtonProps = {
  isin: string;
  isFavorite: boolean;
  isLoading?: boolean;
  onToggle: () => void;
  className?: string;
};

export function FavoriteToggleButton({
  isin,
  isFavorite,
  isLoading = false,
  onToggle,
  className,
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
      className={cn(
        'min-h-[40px] min-w-[40px] items-center justify-center rounded-full border p-xs active:opacity-[0.85]',
        isFavorite ? 'border-primary bg-primary-surface' : 'border-border bg-surface-muted',
        className,
      )}
    >
      <MaterialCommunityIcons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={20}
        color={isFavorite ? theme.primary : theme.textSecondary}
      />
    </Pressable>
  );
}
