import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { ThemedText } from '@/shared/components/themed-text';
import { InfoHintTrigger } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

const COPIED_FEEDBACK_MS = 2000;

export type FundDetailHeroIsinProps = {
  isin: string;
};

export function FundDetailHeroIsin({ isin }: FundDetailHeroIsinProps) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current != null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(isin);
    setCopied(true);
    if (resetTimerRef.current != null) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, COPIED_FEEDBACK_MS);
  }, [isin]);

  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <ThemedText type="metaLabel" themeColor="textSecondary">
          {FUND_GLOSSARY.isin.term}
        </ThemedText>
        <InfoHintTrigger
          surface="detail"
          term={FUND_GLOSSARY.isin.term}
          explanation={FUND_GLOSSARY.isin.explanation}
        />
      </View>
      <View style={styles.valueRow}>
        <ThemedText
          type="caption"
          themeColor="deepOcean"
          selectable
          style={styles.isinValue}
        >
          {isin}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            copied ? `ISIN ${isin} copiado` : `Copiar ISIN ${isin}`
          }
          accessibilityHint="Copia el identificador al portapapeles"
          accessibilityState={{ disabled: copied }}
          hitSlop={8}
          onPress={() => {
            void handleCopy();
          }}
          style={({ pressed }) => [
            styles.copyButton,
            {
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.border,
            },
            pressed && styles.copyButtonPressed,
          ]}
        >
          <MaterialCommunityIcons
            name={copied ? 'check' : 'content-copy'}
            size={18}
            color={copied ? theme.primary : theme.textSecondary}
          />
        </Pressable>
        {copied ? (
          <ThemedText type="metaLabel" style={{ color: theme.primary }}>
            Copiado
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  isinValue: {
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.4,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.chip,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonPressed: {
    opacity: 0.85,
  },
});
