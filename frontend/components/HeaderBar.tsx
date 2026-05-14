import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useCartStore } from "../store/cartStore";
import { COLORS, TYPE, SPACING, RADIUS, shadow, shadowMedium } from "../constants/theme";
import { SPRING_BOUNCE, SPRING_SNAPPY } from "../constants/animations";

interface Props {
  onCartPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HeaderBar({ onCartPress }: Props) {
  const totalItems = useCartStore((s) =>
    s.cartItems.reduce((sum, i) => sum + i.quantity, 0)
  );

  /* ─── Entrance animation ─── */
  const titleOpacity = useSharedValue(0);
  const titleTranslate = useSharedValue(-12);
  const taglineOpacity = useSharedValue(0);

  /* ─── Cart badge bounce ─── */
  const badgeScale = useSharedValue(1);
  const cartBounce = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 600 });
    titleTranslate.value = withSpring(0, { damping: 20, stiffness: 200 });
    taglineOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
  }, []);

  useEffect(() => {
    if (totalItems > 0) {
      badgeScale.value = withSequence(
        withSpring(1.3, SPRING_SNAPPY),
        withSpring(1, SPRING_BOUNCE)
      );
      cartBounce.value = withSequence(
        withSpring(-3, SPRING_SNAPPY),
        withSpring(0, SPRING_BOUNCE)
      );
    }
  }, [totalItems]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const cartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cartBounce.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Animated.Text style={[styles.title, titleStyle]}>
          The Intelligent Bistro
        </Animated.Text>
        <Animated.Text style={[styles.tagline, taglineStyle]}>
          Order naturally — just say what you want
        </Animated.Text>
      </View>

      <AnimatedPressable
        onPress={onCartPress}
        style={[styles.cartButton, cartAnimStyle]}
        hitSlop={8}
      >
        <Text style={styles.cartIcon}>🛒</Text>
        {totalItems > 0 && (
          <Animated.View style={[styles.badge, badgeAnimStyle]}>
            <Text style={styles.badgeText}>
              {totalItems > 99 ? "99+" : totalItems}
            </Text>
          </Animated.View>
        )}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  left: {
    flex: 1,
    paddingRight: SPACING.lg,
  },
  title: {
    ...TYPE.displayMd,
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  tagline: {
    ...TYPE.bodySm,
    color: COLORS.muted,
    marginTop: 2,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  cartIcon: { fontSize: 22 },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    borderWidth: 2.5,
    borderColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
    ...shadowMedium,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },
});
