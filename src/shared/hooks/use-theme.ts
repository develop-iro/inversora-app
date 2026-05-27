import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Colors } from '@/shared/theme/theme';

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return Colors[theme];
}
