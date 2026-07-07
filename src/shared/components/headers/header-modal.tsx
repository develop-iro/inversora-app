import { StyleSheet, View, type StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderActionsRow } from '@/shared/components/headers/header-actions-row';
import type {
  HeaderActionHandlers,
  HeaderActionSpec,
} from '@/shared/components/headers/header-types';
import { useHeaderHorizontalInset } from '@/shared/components/headers/use-header-horizontal-inset';
import { useHeaderActionHandlers } from '@/shared/components/headers/use-header-action-handlers';
import { TextHeading } from '@/shared/components/text/text-heading';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

export type HeaderModalProps = {
  title: string;
  subtitle?: string;
  leadingActions?: readonly HeaderActionSpec[];
  trailingActions?: readonly HeaderActionSpec[];
  onAction?: HeaderActionHandlers;
  safeAreaTop?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_TRAILING_ACTIONS: readonly HeaderActionSpec[] = ['close'];
const HEADER_SAFE_TOP_GAP = Spacing.xs;

/**
 * Modal and sheet header preset with title block and operational actions.
 */
export function HeaderModal({
  title,
  subtitle,
  leadingActions = [],
  trailingActions = DEFAULT_TRAILING_ACTIONS,
  onAction,
  safeAreaTop = true,
  style,
}: HeaderModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headerHorizontalInset = useHeaderHorizontalInset();
  const handlers = useHeaderActionHandlers(onAction);

  return (
    <View
      accessibilityRole="header"
      style={[
        styles.headerBar,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.borderSubtle,
          paddingTop: safeAreaTop ? insets.top + HEADER_SAFE_TOP_GAP : Spacing.sm,
          paddingHorizontal: headerHorizontalInset,
        },
        style,
      ]}
    >
      {leadingActions.length > 0 ? (
        <HeaderActionsRow actions={leadingActions} handlers={handlers} presentation="compact" />
      ) : null}

      <View style={styles.contentRow}>
        <View style={styles.copy}>
          <TextHeading variant="section" themeColor="deepOcean" numberOfLines={2}>
            {title}
          </TextHeading>
          {subtitle ? (
            <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={3}>
              {subtitle}
            </TextParagraph>
          ) : null}
        </View>

        <HeaderActionsRow
          actions={trailingActions}
          handlers={handlers}
          presentation="compact"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
    minHeight: 44,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
});
