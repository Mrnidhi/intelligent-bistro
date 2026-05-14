import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

interface Props {
  label: string;
  value: number;
  bold?: boolean;
}

export function PriceRow({ label, value, bold = false }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[styles.text, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.text, bold && styles.bold]}>${value.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  text: {
    fontSize: 14,
    color: COLORS.dark,
  },
  bold: {
    fontWeight: "700",
  },
});
