import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

/**
 * Inline loading row shown while SORA is generating a response.
 */
export function SoraChatTypingRow() {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="SORA está escribiendo una respuesta"
      className="max-w-[88%] flex-row items-center gap-sm self-start rounded-card border border-primary-border-faint bg-soft-teal-surface-muted px-md py-sm"
    >
      <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-icon-surface">
        <MaterialCommunityIcons name="creation" size={14} color={theme.deepOcean} />
      </View>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        SORA está pensando…
      </TextParagraph>
      <ActivityIndicator size="small" color={theme.primary} />
    </View>
  );
}
