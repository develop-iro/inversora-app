import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { FontFamily } from "@/shared/theme/theme";

export const FLOATING_TAB_BAR_HEIGHT = 76;
export const FLOATING_TAB_BAR_BOTTOM_GAP = 10;
export const FLOATING_TAB_BAR_CONTENT_GAP = 56;

const colors = {
  active: "#0B2E36",
  inactive: "#7A7F85",
  surface: "#FFFFFF",
  border: "rgba(11, 46, 54, 0.08)",
  shadow: "#0B2E36",
} as const;

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

type FloatingTabBarProps = {
  bottomInset: number;
  descriptors: unknown;
  navigation: unknown;
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
};

export function FloatingTabBar({
  bottomInset,
  descriptors,
  navigation,
  state,
}: FloatingTabBarProps) {
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
  const activeRouteKey = state.routes[state.index]?.key;
  const visibleRoutes = state.routes.filter((route) => {
    const options = routeDescriptors[route.key]?.options;

    return tabs[route.name] && options?.href !== null;
  });

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { bottom: bottomInset + FLOATING_TAB_BAR_BOTTOM_GAP },
      ]}
    >
      <View style={[styles.container, { width: Math.min(width - 36, 560) }]}>
        {visibleRoutes.map((route) => {
          const tab = tabs[route.name];
          const isFocused = route.key === activeRouteKey;

          const onPress = () => {
            const event = tabNavigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
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
              style={({ pressed }) => [
                styles.item,
                !isReducedMotionEnabled && pressed && styles.itemPressed,
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  isFocused && styles.iconCircleActive,
                ]}
              >
                <MaterialCommunityIcons
                  color={isFocused ? colors.surface : colors.inactive}
                  name={isFocused ? tab.activeIcon : tab.inactiveIcon}
                  size={isFocused ? 23 : 24}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[styles.label, isFocused && styles.labelActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  container: {
    height: FLOATING_TAB_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 5,
  },
  item: {
    flex: 1,
    minHeight: 64,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  itemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconCircleActive: {
    backgroundColor: colors.active,
  },
  label: {
    maxWidth: "100%",
    marginTop: 2,
    color: colors.inactive,
    fontFamily: FontFamily.display,
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 16,
    textAlign: "center",
  },
  labelActive: {
    color: colors.active,
    fontFamily: FontFamily.displayBold,
    fontWeight: "700",
  },
});
