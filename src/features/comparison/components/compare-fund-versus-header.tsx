import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Pressable, ScrollView, StyleSheet, View } from 'react-native';



import type { CompareFundEntry } from '@/features/comparison/models/compare-fund-entry';

import { FundCardIcon } from '@/features/funds/components/fund-card-icon';

import { TextLabel, TextParagraph } from '@/shared/components/text';

import { Badge, Card, ScorePill } from '@/shared/components/ui';

import { useTheme } from '@/shared/hooks/use-theme';

import { Radius, Spacing } from '@/shared/theme/theme';



export const COMPARE_VERSUS_CARD_MIN_WIDTH = 132;



const VERSUS_CARD_CONTENT = {

  padding: Spacing.md,

  gap: Spacing.xs,

  flex: 1,

  minHeight: 120,

  justifyContent: 'space-between' as const,

};



export type CompareFundVersusHeaderProps = {

  entries: readonly CompareFundEntry[];

  onRemoveFund: (isin: string) => void;

  /** When one fund is selected, renders the second slot as an add action. */

  onAddFund?: () => void;

};



type FundVersusCardProps = {

  entry: CompareFundEntry;

  onRemoveFund: (isin: string) => void;

  compact?: boolean;

};



function VersusMarker() {

  return (

    <Badge

      label="vs"

      variant="muted"

      accessibilityLabel="Versus"

      style={styles.versusBadge}

    />

  );

}



function FundVersusCard({ entry, onRemoveFund, compact = false }: FundVersusCardProps) {

  const theme = useTheme();

  const { detail, isin } = entry;

  const fund = detail?.fund;

  const symbol = fund?.symbol ?? isin.slice(-4);

  const title = fund?.name ?? symbol;

  const subtitle = fund?.themeLabel ?? fund?.categoryLabel ?? 'Sin cargar';



  return (

    <Card

      variant="outlined"

      style={[styles.cardShell, compact && styles.cardCompact]}

      contentStyle={VERSUS_CARD_CONTENT}

    >

      <View style={styles.cardTop}>

        {fund !== undefined ? (

          <FundCardIcon symbol={symbol} logoUrl={fund.logoUrl} style={styles.icon} />

        ) : (

          <View

            style={[

              styles.iconPlaceholder,

              { backgroundColor: theme.backgroundSoft, borderColor: theme.border },

            ]}

          >

            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={theme.textSecondary} />

          </View>

        )}

        <Pressable

          accessibilityRole="button"

          accessibilityLabel={`Quitar ${fund?.name ?? isin}`}

          onPress={() => onRemoveFund(isin)}

          hitSlop={8}

        >

          <MaterialCommunityIcons name="close" size={18} color={theme.textSecondary} />

        </Pressable>

      </View>



      <TextParagraph variant="emphasis" numberOfLines={2}>

        {title}

      </TextParagraph>

      {fund !== undefined ? (

        <TextLabel variant="meta" themeColor="textSecondary" numberOfLines={1}>

          {symbol}

        </TextLabel>

      ) : null}

      <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>

        {subtitle}

      </TextParagraph>



      {detail !== null ? (

        <ScorePill score={detail.inversoraScore} variant="compact" />

      ) : (

        <TextLabel variant="meta" themeColor="textSecondary">

          Sin cargar

        </TextLabel>

      )}

    </Card>

  );

}



function AddFundSlot({ onPress }: { onPress: () => void }) {

  const theme = useTheme();



  return (

    <Card

      variant="outlined"

      onPress={onPress}

      accessibilityRole="button"

      accessibilityLabel="Añadir segundo fondo a la comparación"

      style={[

        styles.cardShell,

        styles.addSlot,

        {

          borderColor: theme.primaryBorder,

          backgroundColor: theme.primarySurface,

        },

      ]}

      contentStyle={styles.addSlotContent}

    >

      <MaterialCommunityIcons name="plus-circle-outline" size={24} color={theme.primary} />

      <TextParagraph variant="emphasis" themeColor="primary" numberOfLines={2} style={styles.addSlotLabel}>

        Añadir fondo

      </TextParagraph>

    </Card>

  );

}



/**

 * Fund header with side-by-side "vs" layout for two funds, or horizontal scroll for more.

 */

export function CompareFundVersusHeader({

  entries,

  onRemoveFund,

  onAddFund,

}: CompareFundVersusHeaderProps) {

  if (entries.length === 0) {

    return null;

  }



  if (entries.length === 1 && onAddFund) {

    return (

      <View style={styles.dualRow} accessibilityRole="summary">

        <FundVersusCard entry={entries[0]!} onRemoveFund={onRemoveFund} />

        <VersusMarker />

        <AddFundSlot onPress={onAddFund} />

      </View>

    );

  }



  if (entries.length === 2) {

    const [left, right] = entries;



    return (

      <View style={styles.dualRow} accessibilityRole="summary">

        <FundVersusCard entry={left} onRemoveFund={onRemoveFund} />

        <VersusMarker />

        <FundVersusCard entry={right} onRemoveFund={onRemoveFund} />

      </View>

    );

  }



  return (

    <ScrollView

      horizontal

      showsHorizontalScrollIndicator={false}

      contentContainerStyle={styles.multiScroll}

      accessibilityRole="list"

      accessibilityLabel="Fondos seleccionados para comparar"

    >

      {entries.map((entry) => (

        <FundVersusCard

          key={entry.isin}

          entry={entry}

          onRemoveFund={onRemoveFund}

          compact

        />

      ))}

    </ScrollView>

  );

}



const styles = StyleSheet.create({

  dualRow: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: Spacing.sm,

  },

  cardShell: {

    flex: 1,

    minWidth: 0,

    borderRadius: Radius.card,

  },

  cardCompact: {

    flex: 0,

    width: COMPARE_VERSUS_CARD_MIN_WIDTH + 28,

  },

  cardTop: {

    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

  },

  icon: {

    width: 32,

    height: 32,

  },

  iconPlaceholder: {

    width: 32,

    height: 32,

    borderRadius: Radius.image,

    borderWidth: StyleSheet.hairlineWidth,

    alignItems: 'center',

    justifyContent: 'center',

  },

  versusBadge: {

    alignSelf: 'center',

    minWidth: 30,

    minHeight: 30,

    paddingHorizontal: Spacing.sm,

    borderRadius: Radius.full,

  },

  multiScroll: {

    gap: Spacing.sm,

    paddingVertical: Spacing.xs,

  },

  addSlot: {

    borderStyle: 'dashed',

  },

  addSlotContent: {

    ...VERSUS_CARD_CONTENT,

    alignItems: 'center',

    justifyContent: 'center',

  },

  addSlotLabel: {

    textAlign: 'center',

  },

});


