import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { COLORS, TYPE, SPACING, RADIUS, shadow } from "../constants/theme";
import { SPRING_BOUNCE, SPRING_SNAPPY } from "../constants/animations";

interface Props {
  text: string;
  onPress: (text: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SuggestedPrompt({ text, onPress }: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        scale.value = withSequence(
          withSpring(0.92, SPRING_SNAPPY),
          withSpring(1, SPRING_BOUNCE)
        );
        onPress(text);
      }}
      style={[styles.chip, animStyle]}
    >
      <Text style={styles.text}>{text}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    ...shadow,
  },
  text: {
    ...TYPE.bodySm,
    color: COLORS.brown,
    fontWeight: "500",
  },
});
