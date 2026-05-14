import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, TYPE, SPACING } from "../constants/theme";

interface Props {
  label: string;
  value: number;
  bold?: boolean;
}

export function PriceRow({ label, value, bold = false }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[styles.text, bold && styles.boldText]}>{label}</Text>
      <Text style={[styles.value, bold && styles.boldValue]}>
        ${value.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.xs + 1,
  },
  text: {
    ...TYPE.bodyMd,
    color: COLORS.muted,
  },
  value: {
    ...TYPE.bodyMd,
    color: COLORS.dark,
    fontWeight: "500",
  },
  boldText: {
    ...TYPE.headlineMd,
    color: COLORS.dark,
  },
  boldValue: {
    ...TYPE.headlineMd,
    color: COLORS.dark,
  },
});
