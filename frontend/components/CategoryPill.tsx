import React, { useEffect, useRef } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolateColor,
} from "react-native-reanimated";
import { COLORS, TYPE, SPACING, RADIUS, CATEGORY_ICONS } from "../constants/theme";
import { SPRING_SNAPPY } from "../constants/animations";

interface Props {
  label: string;
  categoryKey: string;
  active: boolean;
  onPress: () => void;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryPill({ label, categoryKey, active, onPress, index }: Props) {
  const scale = useSharedValue(1);
  const progress = useSharedValue(active ? 1 : 0);
  const enterAnim = useSharedValue(0);
  const icon = CATEGORY_ICONS[categoryKey] ?? "🍽️";

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, SPRING_SNAPPY);
  }, [active]);

  useEffect(() => {
    enterAnim.value = withDelay(index * 50, withSpring(1, { damping: 18, stiffness: 160 }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.white, COLORS.dark]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.border, COLORS.dark]
    ),
    transform: [
      { scale: scale.value },
      { translateY: (1 - enterAnim.value) * 16 },
    ],
    opacity: enterAnim.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.brown, COLORS.white]
    ),
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        scale.value = withSpring(0.93, SPRING_SNAPPY);
        setTimeout(() => {
          scale.value = withSpring(1, SPRING_SNAPPY);
        }, 100);
        onPress();
      }}
      style={[styles.pill, containerStyle]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Animated.Text style={[styles.label, textStyle]}>{label}</Animated.Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    marginRight: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    ...TYPE.labelLg,
  },
});
