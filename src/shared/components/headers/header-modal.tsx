import { View, type StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderActionsRow } from '@/shared/components/headers/header-actions-row';
import type {
  HeaderActionHandlers,
  HeaderActionPresentation,
  HeaderActionSpec,
} from '@/shared/components/headers/header-types';
import { useHeaderActionHandlers } from '@/shared/components/headers/use-header-action-handlers';
import { TextHeading } from '@/shared/components/text/text-heading';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { Layout, Spacing } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type HeaderModalProps = {
  title: string;
  subtitle?: string;
  leadingActions?: readonly HeaderActionSpec[];
  trailingActions?: readonly HeaderActionSpec[];
  onAction?: HeaderActionHandlers;
  /** Icon-only (`compact`) or icon with label (`caption`, default). */
  actionPresentation?: HeaderActionPresentation;
  safeAreaTop?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_TRAILING_ACTIONS: readonly HeaderActionSpec[] = ['close'];
const HEADER_SAFE_TOP_GAP = Spacing.xs;

/**
 * Modal and sheet header preset with title block and operational actions.
 * Content aligns with the centered page column used by modal bodies.
 */
export function HeaderModal({
  title,
  subtitle,
  leadingActions = [],
  trailingActions = DEFAULT_TRAILING_ACTIONS,
  onAction,
  actionPresentation = 'caption',
  safeAreaTop = true,
  className,
  style,
}: HeaderModalProps) {
  const insets = useSafeAreaInsets();
  const { contentWidth } = useMobileLayout();
  const handlers = useHeaderActionHandlers(onAction);

  return (
    <View
      accessibilityRole="header"
      className={cn('border-b border-border-subtle bg-surface', className)}
      // tailwind-exception: safe-area top inset is runtime-only
      style={[
        {
          paddingTop: safeAreaTop ? insets.top + HEADER_SAFE_TOP_GAP : Spacing.sm,
        },
        style,
      ]}
    >
      <View
        className="w-full self-center py-sm"
        // tailwind-exception: content column width matches centered scroll body
        style={{
          width: contentWidth,
          maxWidth: contentWidth,
          paddingHorizontal: Layout.screenPaddingHorizontal,
        }}
      >
        {leadingActions.length > 0 ? (
          <View className="pb-sm">
            <HeaderActionsRow
              actions={leadingActions}
              handlers={handlers}
              presentation={actionPresentation}
            />
          </View>
        ) : null}

        <View className="min-h-[44px] flex-row items-center justify-between gap-md">
          <View className="min-w-0 flex-1 justify-center gap-[2px] pr-sm">
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
            presentation={actionPresentation}
          />
        </View>
      </View>
    </View>
  );
}
