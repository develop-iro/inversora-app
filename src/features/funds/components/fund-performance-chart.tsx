import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { FundPerformancePoint } from '@/core/domain/fund-market';
import {
  buildPerformanceChartCoordinates,
  downsamplePerformancePoints,
} from '@/features/funds/utils/fund-performance';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius } from '@/shared/theme/theme';

const CHART_HEIGHT = 168;
const LINE_THICKNESS = 2.5;

export type FundPerformanceChartProps = {
  points: FundPerformancePoint[];
  accessibilityLabel: string;
};

type ChartSegmentProps = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
};

function ChartSegment({ startX, startY, endX, endY, color }: ChartSegmentProps) {
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.hypot(dx, dy);

  if (length < 0.5) {
    return null;
  }

  const angle = `${(Math.atan2(dy, dx) * 180) / Math.PI}deg`;
  const centerX = (startX + endX) / 2;
  const centerY = (startY + endY) / 2;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.segment,
        {
          width: length,
          height: LINE_THICKNESS,
          left: centerX - length / 2,
          top: centerY - LINE_THICKNESS / 2,
          backgroundColor: color,
          transform: [{ rotate: angle }],
        },
      ]}
    />
  );
}

export function FundPerformanceChart({
  points,
  accessibilityLabel,
}: FundPerformanceChartProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  const sampledPoints = useMemo(
    () => downsamplePerformancePoints(points),
    [points],
  );

  const chartGeometry = useMemo(
    () => buildPerformanceChartCoordinates(sampledPoints, width, CHART_HEIGHT),
    [sampledPoints, width],
  );

  const hasChart = width > 0 && chartGeometry.coordinates.length > 1;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={styles.wrapper}
      onLayout={(event) => {
        const nextWidth = Math.round(event.nativeEvent.layout.width);
        if (nextWidth !== width) {
          setWidth(nextWidth);
        }
      }}
    >
      {hasChart ? (
        <View style={[styles.canvas, { width, height: CHART_HEIGHT }]}>
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(0, 191, 166, 0.22)', 'rgba(0, 191, 166, 0.02)']}
            style={styles.areaFill}
          />
          {chartGeometry.coordinates.slice(1).map((end, index) => {
            const start = chartGeometry.coordinates[index];
            return (
              <ChartSegment
                key={`${start.x}-${start.y}-${end.x}-${end.y}`}
                startX={start.x}
                startY={start.y}
                endX={end.x}
                endY={end.y}
                color={theme.primary}
              />
            );
          })}
        </View>
      ) : (
        <View style={[styles.placeholder, { backgroundColor: theme.backgroundSoft }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    minHeight: CHART_HEIGHT,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  canvas: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: Radius.card,
  },
  areaFill: {
    ...StyleSheet.absoluteFill,
  },
  segment: {
    position: 'absolute',
    borderRadius: LINE_THICKNESS / 2,
  },
  placeholder: {
    flex: 1,
    minHeight: CHART_HEIGHT,
    borderRadius: Radius.card,
  },
});
