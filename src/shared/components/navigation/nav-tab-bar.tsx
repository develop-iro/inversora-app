import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSegments } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { useTheme } from "@/shared/hooks/use-theme";
import { useSecondaryTabConfig } from "@/features/learn/hooks/use-secondary-tab-config";
import {
  resolveTabBarDisplayLabel,
  resolveTabBarLayoutMetrics,
} from "@/shared/navigation/tab-bar-layout";
import {
  createFundsCatalogTabParams,
  FUNDS_TAB_NAME,
  isFundDetailPath,
  isLegalPath,
  isQuestionnairePath,
} from "@/shared/navigation/tab-route-state";
import { Size, Spacing } from "@/shared/theme/theme";
import { Typography } from "@/shared/theme/tokens";

const FILL_ANIMATION_DURATION_MS = 280;
const ICON_SIZE = Size.iconMd;
const ICON_SLOT_SIZE = Size.iconSlot;
const TAB_BAR_VERTICAL_PADDING = Platform.select({
  ios: Spacing.sm,
  default: Spacing.tight,
}) ?? Spacing.tight;

export const NAV_TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 80 : 76;
export const NAV_TAB_BAR_BOTTOM_GAP = Spacing.lgPlus;
export const NAV_TAB_BAR_CONTENT_GAP = Spacing['3xl'] + Spacing.lg;

/**
 * Matches the safe-area clamp used when positioning the floating tab bar.
 */
export function resolveNavTabSafeBottomInset(insetsBottom: number): number {
  return Platform.OS === 'ios' ? Math.min(Math.max(insetsBottom, 8), 28) : 0;
}

/**
 * Vertical space reserved above the bottom edge for the floating tab bar plus content breathing room.
 */
export function getTabBarClearance(safeBottomInset: number): number {
  return (
    safeBottomInset +
    NAV_TAB_BAR_BOTTOM_GAP +
    NAV_TAB_BAR_HEIGHT +
    NAV_TAB_BAR_CONTENT_GAP
  );
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type TabConfig = {
  label: string;
  compactLabel?: string;
  accessibilityLabel: string;
  activeIcon: IconName;
  inactiveIcon: IconName;
};

const tabs: Record<string, TabConfig> = {
  index: {
    label: "Inicio",
    accessibilityLabel: "Ir a Inicio",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  funds: {
    label: "Fondos",
    accessibilityLabel: "Explorar fondos",
    activeIcon: "magnify",
    inactiveIcon: "magnify",
  },
  learn: {
    label: "Aprendizaje",
    compactLabel: "Aprende",
    accessibilityLabel: "Abrir aprendizaje",
    activeIcon: "book-open-page-variant",
    inactiveIcon: "book-open-page-variant-outline",
  },
  favorites: {
    label: "Favoritos",
    compactLabel: "Favoritos",
    accessibilityLabel: "Ver favoritos",
    activeIcon: "heart",
    inactiveIcon: "heart-outline",
  },
  compare: {
    label: "Comparar",
    compactLabel: "Compara",
    accessibilityLabel: "Comparar fondos",
    activeIcon: "scale-balance",
    inactiveIcon: "scale-balance",
  },
  calculator: {
    label: "Calcular",
    compactLabel: "Calcula",
    accessibilityLabel: "Abrir calculadora",
    activeIcon: "calculator-variant",
    inactiveIcon: "calculator-variant-outline",
  },
};

/**
 * Builds the visible tab order. Aprendizaje and Favoritos share the middle slot
 * but keep dedicated routes (`/learn` vs `/favorites`).
 */
function resolveTabRouteOrder(secondaryMode: 'learn' | 'favorites'): readonly string[] {
  const secondaryRoute = secondaryMode === 'learn' ? 'learn' : 'favorites';

  return ['index', 'funds', secondaryRoute, 'compare', 'calculator'];
}

type NavTabBarProps = {
  bottomInset: number;
  descriptors: unknown;
  navigation: unknown;
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
};

type TabBarLabelMetrics = {
  fontSize: number;
  lineHeight: number;
  minimumFontScale: number;
};

type TabBarVisualProps = {
  activeIcon: IconName;
  inactiveIcon: IconName;
  isFocused: boolean;
  isReducedMotionEnabled: boolean;
  label: string;
  labelMetrics: TabBarLabelMetrics;
  tabActive: string;
  tabInactive: string;
};

/**
 * Animates icon outline-to-filled transition and label emphasis on focus.
 */
function TabBarVisual({
  activeIcon,
  inactiveIcon,
  isFocused,
  isReducedMotionEnabled,
  label,
  labelMetrics,
  tabActive,
  tabInactive,
}: TabBarVisualProps) {
  const fillProgress = useSharedValue(isFocused ? 1 : 0);
  const hasDistinctIcons = activeIcon !== inactiveIcon;

  useEffect(() => {
    const target = isFocused ? 1 : 0;

    fillProgress.value = isReducedMotionEnabled
      ? target
      : withTiming(target, {
          duration: FILL_ANIMATION_DURATION_MS,
          easing: Easing.out(Easing.cubic),
        });
  }, [fillProgress, isFocused, isReducedMotionEnabled]);

  const outlineIconStyle = useAnimatedStyle(() => ({
    opacity: hasDistinctIcons
      ? interpolate(fillProgress.value, [0, 0.45, 1], [1, 0.35, 0])
      : interpolate(fillProgress.value, [0, 1], [1, 0]),
    transform: [
      {
        scale: interpolate(fillProgress.value, [0, 1], [1, 0.92]),
      },
    ],
  }));

  const filledIconStyle = useAnimatedStyle(() => ({
    opacity: fillProgress.value,
    transform: [
      {
        scale: interpolate(fillProgress.value, [0, 1], [0.68, 1]),
      },
    ],
  }));

  const labelColorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(fillProgress.value, [0, 1], [tabInactive, tabActive]),
  }));

  return (
    <View style={styles.tabContent}>
      <View style={styles.iconSlot}>
        <View style={styles.iconStack}>
          <Animated.View style={[styles.iconLayer, outlineIconStyle]}>
            <MaterialCommunityIcons
              color={tabInactive}
              name={hasDistinctIcons ? inactiveIcon : activeIcon}
              size={ICON_SIZE}
            />
          </Animated.View>
          <Animated.View style={[styles.iconLayer, filledIconStyle]}>
            <MaterialCommunityIcons
              color={tabActive}
              name={activeIcon}
              size={ICON_SIZE}
            />
          </Animated.View>
        </View>
      </View>

      <View
        style={[
          styles.labelBox,
          { height: labelMetrics.lineHeight },
        ]}
      >
        <Animated.Text
          adjustsFontSizeToFit
          minimumFontScale={labelMetrics.minimumFontScale}
          numberOfLines={1}
          // tailwind-exception: single label layer so iOS adjustsFontSizeToFit scales copy reliably
          style={[
            styles.label,
            isFocused ? styles.labelActive : null,
            {
              fontSize: labelMetrics.fontSize,
              lineHeight: labelMetrics.lineHeight,
            },
            labelColorStyle,
          ]}
        >
          {label}
        </Animated.Text>
      </View>
    </View>
  );
}

/**
 * Bottom navigation tab bar for primary app routes.
 */
export function NavTabBar({
  bottomInset,
  descriptors,
  navigation,
  state,
}: NavTabBarProps) {
  const theme = useTheme(); // tailwind-exception: tab icon colors and native shadowColor
  const isReducedMotionEnabled = useReducedMotion();
  const { width } = useWindowDimensions();
  const layoutMetrics = useMemo(
    () => resolveTabBarLayoutMetrics(width, Platform.OS),
    [width],
  );
  const tabNavigation = navigation as {
    emit: (event: {
      canPreventDefault?: boolean;
      target: string;
      type: "tabLongPress" | "tabPress";
    }) => { defaultPrevented?: boolean };
    navigate: (name: string, params?: object) => void;
  };
  const routeDescriptors = descriptors as Record<
    string,
    { options?: { href?: string | null } }
  >;
  const segments = useSegments();
  const secondaryTab = useSecondaryTabConfig();
  const hideOnFundDetail = useMemo(() => isFundDetailPath(segments), [segments]);
  const hideOnQuestionnaire = useMemo(() => isQuestionnairePath(segments), [segments]);
  const hideOnLegal = useMemo(() => isLegalPath(segments), [segments]);
  const activeRoute = state.routes[state.index];
  const tabRouteOrder = useMemo(
    () => resolveTabRouteOrder(secondaryTab.mode),
    [secondaryTab.mode],
  );

  const visibleRoutes = tabRouteOrder.map((routeName) => {
    const route = state.routes.find((candidate) => candidate.name === routeName);
    if (!route) {
      return null;
    }

    const options = routeDescriptors[route.key]?.options;
    if (!tabs[route.name] || options?.href === null) {
      return null;
    }

    return route;
  }).filter((route): route is (typeof state.routes)[number] => route !== null);

  if (hideOnFundDetail || hideOnQuestionnaire || hideOnLegal) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 items-center bg-transparent"
      // tailwind-exception: bottom offset combines safe area and design gap; zIndex keeps bar above scroll content
      style={{ bottom: bottomInset + NAV_TAB_BAR_BOTTOM_GAP, zIndex: 1000 }}
    >
      <View
        pointerEvents="auto"
        className="flex-row items-stretch justify-between overflow-hidden rounded-tabBar border border-border bg-surface shadow-card"
        // tailwind-exception: responsive width cap, native shadowColor, platform padding and height
        style={[
          styles.container,
          {
            width: layoutMetrics.barWidth,
            height: NAV_TAB_BAR_HEIGHT,
            paddingHorizontal: layoutMetrics.horizontalPadding,
            paddingVertical: TAB_BAR_VERTICAL_PADDING,
            shadowColor: theme.shadow,
            elevation: 10,
            zIndex: 1000,
          },
        ]}
      >
        {visibleRoutes.map((route) => {
          const baseTab = tabs[route.name];
          if (!baseTab) {
            return null;
          }

          const tab =
            route.name === 'learn' || route.name === 'favorites'
              ? {
                  label: resolveTabBarDisplayLabel(
                    secondaryTab.label,
                    secondaryTab.compactLabel,
                    layoutMetrics.isCompact,
                  ),
                  accessibilityLabel: secondaryTab.accessibilityLabel,
                  activeIcon: secondaryTab.activeIcon,
                  inactiveIcon: secondaryTab.inactiveIcon,
                }
              : {
                  ...baseTab,
                  label: resolveTabBarDisplayLabel(
                    baseTab.label,
                    baseTab.compactLabel,
                    layoutMetrics.isCompact,
                  ),
                };

          const isFocused = activeRoute?.key === route.key;

          const onPress = () => {
            const event = tabNavigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              return;
            }

            if (route.name === FUNDS_TAB_NAME) {
              if (!isFocused) {
                tabNavigation.navigate(FUNDS_TAB_NAME, createFundsCatalogTabParams());
              }
              return;
            }

            if (!isFocused) {
              tabNavigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            tabNavigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              accessibilityLabel={tab.accessibilityLabel}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : undefined}
              hitSlop={{ top: 8, bottom: 8, left: 2, right: 2 }}
              key={route.key}
              onLongPress={onLongPress}
              onPress={onPress}
              // tailwind-exception: equal tab slots + web button reset
              style={({ pressed }) => [
                styles.item,
                !isReducedMotionEnabled &&
                  pressed &&
                  Platform.OS !== "web" &&
                  styles.itemPressed,
              ]}
            >
              <TabBarVisual
                activeIcon={tab.activeIcon}
                inactiveIcon={tab.inactiveIcon}
                isFocused={isFocused}
                isReducedMotionEnabled={isReducedMotionEnabled}
                label={tab.label}
                labelMetrics={{
                  fontSize: layoutMetrics.labelFontSize,
                  lineHeight: layoutMetrics.labelLineHeight,
                  minimumFontScale: layoutMetrics.minimumFontScale,
                }}
                tabActive={theme.tabActive}
                tabInactive={theme.tabInactive}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: Platform.select({
    web: {
      boxSizing: 'border-box',
    },
    default: {},
  }),
  tabContent: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    flexBasis: 0,
    alignSelf: 'stretch',
    minHeight: Size.tabBarItemMin,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        borderWidth: 0,
        outlineWidth: 0,
        boxShadow: 'none',
        cursor: 'pointer',
        appearance: 'none',
      } as const,
      default: {},
    }),
  },
  itemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  iconSlot: {
    width: ICON_SLOT_SIZE,
    height: ICON_SLOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  iconStack: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  iconLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBox: {
    alignSelf: 'stretch',
    width: '100%',
    marginTop: Spacing.xs,
    position: 'relative',
  },
  label: {
    ...Typography.tabLabel,
    textAlign: 'center',
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
      default: {},
    }),
  },
  labelActive: {
    ...Typography.tabLabelActive,
  },
});
