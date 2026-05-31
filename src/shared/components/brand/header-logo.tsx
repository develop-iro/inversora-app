import { Platform, StyleSheet, Text, View } from "react-native";

const brandSerif = Platform.select({
  ios: "Georgia",
  android: "serif",
  web: "Georgia, Times New Roman, serif",
  default: "serif",
});

export function HeaderLogo() {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Invesora"
      style={styles.wrapper}
    >
      <Text style={styles.wordmark}>Invesora</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    minWidth: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    color: "#0B2E36",
    fontFamily: brandSerif,
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "700",
  },
});
