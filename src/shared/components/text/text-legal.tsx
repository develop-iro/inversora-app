import type { TextProps } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import type { ThemeColor } from '@/shared/theme/theme';

export type TextLegalProps = TextProps & {
  themeColor?: ThemeColor;
};

/**
 * Legal and risk disclaimers with the compact legal typography preset.
 */
export function TextLegal({ themeColor = 'textSecondary', ...rest }: TextLegalProps) {
  return <ThemedText type="legal" themeColor={themeColor} {...rest} />;
}
