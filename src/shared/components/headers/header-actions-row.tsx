import { StyleSheet, View } from 'react-native';

import { HeaderAction } from '@/shared/components/headers/header-action';
import type {
  HeaderActionHandlers,
  HeaderActionPresentation,
  HeaderActionSpec,
} from '@/shared/components/headers/header-types';
import {
  resolveHeaderActionA11yLabel,
  resolveHeaderActionId,
  resolveHeaderActionPressOverride,
} from '@/shared/components/headers/header-types';
import { resolveHeaderActionPress } from '@/shared/components/headers/use-header-action-handlers';
import { Spacing } from '@/shared/theme/theme';

export type HeaderActionsRowProps = {
  actions: readonly HeaderActionSpec[];
  handlers: HeaderActionHandlers;
  presentation?: HeaderActionPresentation;
};

/**
 * Renders a horizontal group of configured header actions, skipping unresolved handlers.
 */
export function HeaderActionsRow({
  actions,
  handlers,
  presentation = 'compact',
}: HeaderActionsRowProps) {
  const nodes = actions
    .map((spec) => {
      const action = resolveHeaderActionId(spec);
      const onPress = resolveHeaderActionPress(
        action,
        handlers,
        resolveHeaderActionPressOverride(spec),
      );

      if (!onPress) {
        return null;
      }

      return (
        <HeaderAction
          key={action}
          action={action}
          onPress={onPress}
          presentation={presentation}
          accessibilityLabel={resolveHeaderActionA11yLabel(spec)}
        />
      );
    })
    .filter((node) => node !== null);

  if (nodes.length === 0) {
    return <View style={styles.spacer} />;
  }

  return <View style={styles.row}>{nodes}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 0,
  },
  spacer: {
    width: 40,
    height: 40,
  },
});
