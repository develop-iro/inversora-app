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
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { useTheme } from "@/shared/hooks/use-theme";
import {
  createFundsCatalogTabParams,
  FUNDS_TAB_NAME,
  isFundDetailPath,
  isLearnPath,
  isLegalPath,
} from "@/shared/navigation/tab-route-state";
import { Size, Spacing } from "@/shared/theme/theme";
import { Typography } from "@/shared/theme/tokens";

const FILL_ANIMATION_DURATION_MS = 280;
const ICON_SIZE = Size.iconMd;
const ICON_SLOT_SIZE = Size.iconSlot;

export const NAV_TAB_BAR_HEIGHT = 76;
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
  favorites: {
    label: "Favoritos",
    accessibilityLabel: "Ver favoritos",
    activeIcon: "heart",
    inactiveIcon: "heart-outline",
  },
  compare: {
    label: "Comparar",
    accessibilityLabel: "Comparar fondos",
    activeIcon: "scale-balance",
    inactiveIcon: "scale-balance",
  },
  calculator: {
    label: "Calcular",
    accessibilityLabel: "Abrir calculadora",
    activeIcon: "calculator-variant",
    inactiveIcon: "calculator-variant-outline",
  },
};

/** Top-level tab routes only — avoids duplicate `index` from nested stacks (e.g. funds/index). */
const TAB_ROUTE_ORDER = [
  "index",
  "funds",
  "favorites",
  "compare",
  "calculator",
] as const;

type NavTabBarProps = {
  bottomInset: number;
  descriptors: unknown;
  navigation: unknown;
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
};

type TabBarVisualProps = {
  activeIcon: IconName;
  inactiveIcon: IconName;
  isFocused: boolean;
  isReducedMotionEnabled: boolean;
  label: string;
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

  const inactiveLabelStyle = useAnimatedStyle(() => ({
    opacity: 1 - fillProgress.value,
  }));

  const activeLabelStyle = useAnimatedStyle(() => ({
    opacity: fillProgress.value,
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

      <View style={styles.labelBox}>
        <Animated.Text
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          numberOfLines={1}
          // tailwind-exception: animated label crossfade; Typography via StyleSheet for correct width/ellipsis
          style={[
            styles.label,
            styles.labelLayer,
            { color: tabInactive },
            inactiveLabelStyle,
          ]}
        >
          {label}
        </Animated.Text>
        <Animated.Text
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          numberOfLines={1}
          // tailwind-exception: animated label crossfade; Typography via StyleSheet for correct width/ellipsis
          style={[
            styles.label,
            styles.labelActive,
            styles.labelLayer,
            { color: tabActive },
            activeLabelStyle,
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
  const hideOnFundDetail = useMemo(() => isFundDetailPath(segments), [segments]);
  const hideOnLearn = useMemo(() => isLearnPath(segments), [segments]);
  const hideOnLegal = useMemo(() => isLegalPath(segments), [segments]);
  const activeRoute = state.routes[state.index];

  const visibleRoutes = TAB_ROUTE_ORDER.map((routeName) => {
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

  if (hideOnFundDetail || hideOnLearn || hideOnLegal) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 items-center bg-transparent"
      // tailwind-exception: bottom offset combines safe area and design gap
      style={{ bottom: bottomInset + NAV_TAB_BAR_BOTTOM_GAP }}
    >
      <View
        className="h-[76px] flex-row items-center justify-between overflow-hidden rounded-tabBar border border-border bg-surface px-lgPlus py-tight shadow-card"
        // tailwind-exception: responsive width cap, native shadowColor, web box model
        style={[
          styles.container,
          {
            width: Math.min(width - 36, 560),
            shadowColor: theme.shadow,
            elevation: 5,
          },
        ]}
      >
        {visibleRoutes.map((route) => {
          const tab = tabs[route.name];
          if (!tab) {
            return null;
          }

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
    minHeight: Size.tabBarItemMin,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: Typography.tabLabel.lineHeight,
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
  labelLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});
