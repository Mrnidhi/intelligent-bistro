import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

interface Props {
  text: string;
  onPress: (text: string) => void;
}

export function SuggestedPrompt({ text, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(text)} style={styles.chip}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.warm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: { fontSize: 12, color: COLORS.brown },
});
