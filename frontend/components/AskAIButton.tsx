import React, { useEffect } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { COLORS, SPACING, RADIUS, TYPE, shadowLarge } from "../constants/theme";
import { SPRING_BOUNCE, SPRING_SNAPPY } from "../constants/animations";

interface Props {
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AskAIButton({ onPress }: Props) {
  const scale = useSharedValue(1);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.4);
  const enterScale = useSharedValue(0);
  const sparkle = useSharedValue(0);

  useEffect(() => {
    // Entrance spring
    enterScale.value = withDelay(600, withSpring(1, { damping: 14, stiffness: 160 }));

    // Continuous pulse glow
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 1800 }),
        withTiming(0.4, { duration: 1800 })
      ),
      -1,
      true
    );

    // Sparkle rotation
    sparkle.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * enterScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.fabWrapper, containerStyle]}>
      {/* Glow ring */}
      <Animated.View style={[styles.glow, glowStyle]} />

      <AnimatedPressable
        onPress={() => {
          scale.value = withSequence(
            withSpring(0.88, SPRING_SNAPPY),
            withSpring(1, SPRING_BOUNCE)
          );
          onPress();
        }}
        style={styles.fab}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>✨</Text>
        </View>
        <Text style={styles.label}>Ask AI</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    position: "absolute",
    bottom: 28,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 120,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.aiPulse,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.dark,
    paddingLeft: 8,
    paddingRight: SPACING.xl,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    ...shadowLarge,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm + 2,
  },
  icon: { fontSize: 17 },
  label: {
    color: COLORS.white,
    ...TYPE.labelLg,
    fontWeight: "700",
  },
});
