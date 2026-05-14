import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function CategoryPill({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.label, active ? styles.activeText : styles.inactiveText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  active: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  inactive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeText: { color: COLORS.white },
  inactiveText: { color: COLORS.muted },
});
