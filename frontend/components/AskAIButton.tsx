import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/theme";

interface Props {
  onPress: () => void;
}

export function AskAIButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.fab}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>✨</Text>
      </View>
      <Text style={styles.label}>Ask AI</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.dark,
    paddingLeft: 6,
    paddingRight: 18,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  icon: { fontSize: 16 },
  label: { color: COLORS.white, fontSize: 14, fontWeight: "700" },
});
