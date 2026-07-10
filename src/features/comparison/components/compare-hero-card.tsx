import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { StyleSheet, View } from 'react-native';



import { TextLabel, TextParagraph } from '@/shared/components/text';

import { useTheme } from '@/shared/hooks/use-theme';

import { Radius, Spacing } from '@/shared/theme/theme';



/**

 * Hero promo card for the compare empty state (high-contrast deep surface).

 */

export function CompareHeroCard() {

  const theme = useTheme();



  return (

    <View

      style={[styles.card, { backgroundColor: theme.deepOcean }]}

      accessibilityRole="summary"

      accessibilityLabel="Compara fondos con criterios educativos objetivos"

    >

      <View style={styles.topRow}>

        <View style={[styles.badge, { backgroundColor: theme.accentMintSurface }]}>

          <TextLabel variant="meta" style={[styles.badgeText, { color: theme.accentMintText }]}>

            Guía educativa

          </TextLabel>

        </View>

        <MaterialCommunityIcons name="scale-balance" size={28} color={theme.primary} />

      </View>



      <TextParagraph variant="emphasis" themeColor="textOnDark">

        Compara con criterios claros

      </TextParagraph>

      <TextParagraph variant="secondary" themeColor="textOnDarkMuted" style={styles.subtitle}>

        TER, tracking error, riesgo y Score Inversora en una sola vista. Sin recomendación de

        inversión.

      </TextParagraph>

    </View>

  );

}



const styles = StyleSheet.create({

  card: {

    borderRadius: Radius.card,

    padding: Spacing.lg,

    gap: Spacing.sm,

  },

  topRow: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

  },

  badge: {

    borderRadius: Radius.pill,

    paddingHorizontal: Spacing.md,

    paddingVertical: Spacing.xs,

  },

  badgeText: {

    textTransform: 'uppercase',

    letterSpacing: 0.5,

  },

  subtitle: {

    lineHeight: 20,

  },

});

