import { View, type ViewProps } from 'react-native';

import { cn } from '@/shared/utils/cn';

export type DividerProps = ViewProps & {
  /** Vertical space above and below the line. */
  spacing?: number;
  /** Indent from the start edge (e.g. for list rows with icons). */
  insetStart?: number;
  /** Indent from the end edge. */
  insetEnd?: number;
  className?: string;
};

export function Divider({
  spacing,
  insetStart = 0,
  insetEnd = 0,
  className,
  style,
  ...viewProps
}: DividerProps) {
  return (
    <View
      className={cn('self-stretch', spacing === 0 ? undefined : spacing === undefined ? 'my-lg' : undefined, className)}
      style={[
        spacing !== undefined && spacing !== 0 ? { marginVertical: spacing } : undefined,
        insetStart !== 0 || insetEnd !== 0
          ? { marginStart: insetStart, marginEnd: insetEnd }
          : undefined,
        style,
      ]}
      accessibilityRole="none"
      {...viewProps}
    >
      <View className="h-px min-h-[1px] w-full bg-border" />
    </View>
  );
}
