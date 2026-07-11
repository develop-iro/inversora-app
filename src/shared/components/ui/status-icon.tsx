import Svg, { Circle, Line, Path } from 'react-native-svg';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import {
  STATUS_ICON_COLORS,
  STATUS_ICON_GLYPH_COLOR,
  type StatusIconVariant,
} from '@/shared/components/ui/status-icon-tokens';
import { cn } from '@/shared/utils/cn';

const STATUS_ICON_SIZE = {
  md: 56,
  lg: 72,
} as const;

export type StatusIconSize = keyof typeof STATUS_ICON_SIZE;

export type StatusIconProps = {
  variant: StatusIconVariant;
  size?: StatusIconSize;
  accessibilityLabel?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

function resolveAccessibilityLabel(variant: StatusIconVariant, label?: string): string {
  if (label) {
    return label;
  }

  switch (variant) {
    case 'success':
      return 'Éxito';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Aviso';
    default: {
      const exhaustiveCheck: never = variant;
      return exhaustiveCheck;
    }
  }
}

function SuccessGlyph({ dimension }: { dimension: number }) {
  const strokeWidth = dimension * 0.1;

  return (
    <>
      <Circle cx={dimension / 2} cy={dimension / 2} r={dimension / 2} fill={STATUS_ICON_COLORS.success} />
      <Path
        d={`M${dimension * 0.28} ${dimension * 0.52} L${dimension * 0.44} ${dimension * 0.68} L${dimension * 0.74} ${dimension * 0.34}`}
        stroke={STATUS_ICON_GLYPH_COLOR}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  );
}

function ErrorGlyph({ dimension }: { dimension: number }) {
  const strokeWidth = dimension * 0.1;
  const inset = dimension * 0.3;

  return (
    <>
      <Circle cx={dimension / 2} cy={dimension / 2} r={dimension / 2} fill={STATUS_ICON_COLORS.error} />
      <Line
        x1={inset}
        y1={inset}
        x2={dimension - inset}
        y2={dimension - inset}
        stroke={STATUS_ICON_GLYPH_COLOR}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1={dimension - inset}
        y1={inset}
        x2={inset}
        y2={dimension - inset}
        stroke={STATUS_ICON_GLYPH_COLOR}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </>
  );
}

function WarningGlyph({ dimension }: { dimension: number }) {
  const centerX = dimension / 2;
  const topY = dimension * 0.14;
  const bottomY = dimension * 0.86;
  const halfBase = dimension * 0.34;
  const cornerRadius = dimension * 0.05;
  const barWidth = dimension * 0.1;
  const barTopY = dimension * 0.4;
  const barBottomY = dimension * 0.6;
  const dotRadius = dimension * 0.05;
  const dotCenterY = dimension * 0.7;

  return (
    <>
      <Path
        d={`M${centerX} ${topY} L${centerX + halfBase - cornerRadius} ${bottomY - cornerRadius} Q${centerX + halfBase} ${bottomY} ${centerX + halfBase - cornerRadius * 2} ${bottomY} L${centerX - halfBase + cornerRadius * 2} ${bottomY} Q${centerX - halfBase} ${bottomY} ${centerX - halfBase + cornerRadius} ${bottomY - cornerRadius} Z`}
        fill={STATUS_ICON_COLORS.warning}
      />
      <Path
        d={`M${centerX - barWidth / 2} ${barTopY} H${centerX + barWidth / 2} V${barBottomY} H${centerX - barWidth / 2} Z`}
        fill={STATUS_ICON_GLYPH_COLOR}
      />
      <Circle cx={centerX} cy={dotCenterY} r={dotRadius} fill={STATUS_ICON_GLYPH_COLOR} />
    </>
  );
}

function StatusGlyph({
  variant,
  dimension,
}: {
  variant: StatusIconVariant;
  dimension: number;
}) {
  switch (variant) {
    case 'success':
      return <SuccessGlyph dimension={dimension} />;
    case 'error':
      return <ErrorGlyph dimension={dimension} />;
    case 'warning':
      return <WarningGlyph dimension={dimension} />;
    default: {
      const exhaustiveCheck: never = variant;
      return exhaustiveCheck;
    }
  }
}

/**
 * Generic filled status icon (success, error, warning) for empty and reload states.
 */
export function StatusIcon({
  variant,
  size = 'lg',
  accessibilityLabel,
  className,
  style,
}: StatusIconProps) {
  const dimension = STATUS_ICON_SIZE[size];

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={resolveAccessibilityLabel(variant, accessibilityLabel)}
      className={cn('items-center justify-center', className)}
      // tailwind-exception: explicit SVG viewport size
      style={[{ width: dimension, height: dimension }, style]}
    >
      <Svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <StatusGlyph variant={variant} dimension={dimension} />
      </Svg>
    </View>
  );
}
