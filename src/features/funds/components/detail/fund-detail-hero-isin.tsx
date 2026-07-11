import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { toast } from '@/core/overlay';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { InfoHintTrigger } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type FundDetailHeroIsinProps = {
  isin: string;
  className?: string;
};

export function FundDetailHeroIsin({ isin, className }: FundDetailHeroIsinProps) {
  const theme = useTheme();

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(isin);
    toast.success('ISIN copiado al portapapeles', {
      title: isin,
    });
  }, [isin]);

  return (
    <View className={cn('mt-xs gap-xs', className)}>
      <View className="flex-row items-center gap-xs">
        <TextLabel variant="meta" themeColor="textSecondary">
          {FUND_GLOSSARY.isin.term}
        </TextLabel>
        <InfoHintTrigger
          surface="detail"
          term={FUND_GLOSSARY.isin.term}
          explanation={FUND_GLOSSARY.isin.explanation}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-sm">
        <TextParagraph
          variant="secondary"
          themeColor="deepOcean"
          selectable
          className="tracking-[0.4px]"
          // tailwind-exception: tabular-nums not available as a semantic token
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {isin}
        </TextParagraph>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Copiar ISIN ${isin}`}
          accessibilityHint="Copia el identificador al portapapeles"
          hitSlop={8}
          onPress={() => {
            void handleCopy();
          }}
          className="h-9 w-9 items-center justify-center rounded-chip border border-border bg-surface-muted active:opacity-[0.85]"
        >
          <MaterialCommunityIcons name="content-copy" size={18} color={theme.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}
