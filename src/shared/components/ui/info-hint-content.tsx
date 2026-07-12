import { View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';

export type InfoHintContentProps = {
  readonly explanation: string;
};

/**
 * Shared body copy for InfoHint popover and sheet modal presentations.
 */
export function InfoHintContent({ explanation }: InfoHintContentProps) {
  return (
    <View className="gap-xs">
      <TextParagraph variant="secondary" themeColor="textSecondary" className="leading-[20px]">
        {explanation}
      </TextParagraph>
    </View>
  );
}
