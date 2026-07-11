import { View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { Divider } from '@/shared/components/ui/divider';
import { cn } from '@/shared/utils/cn';

export type KeyValueRow = {
  id: string;
  label: string;
  value: string;
  emphasis?: 'link';
};

export type KeyValueListProps = {
  rows: KeyValueRow[];
  className?: string;
};

export function KeyValueList({ rows, className }: KeyValueListProps) {
  return (
    <View className={cn('self-stretch', className)}>
      {rows.map((row, index) => (
        <View key={row.id}>
          <View className="min-h-[48px] flex-row items-start justify-between gap-md py-md">
            <TextParagraph variant="default" className="min-w-0 flex-1" numberOfLines={2}>
              {row.label}
            </TextParagraph>
            <TextParagraph
              variant="emphasis"
              themeColor={row.emphasis === 'link' ? 'primary' : undefined}
              className="max-w-[52%] shrink-0 text-right"
              numberOfLines={3}
            >
              {row.value}
            </TextParagraph>
          </View>
          {index < rows.length - 1 ? <Divider spacing={0} className="my-0" /> : null}
        </View>
      ))}
    </View>
  );
}
