import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import { MenuItem } from "../types/menu";
import {
  COLORS,
  TYPE,
  SPACING,
  RADIUS,
  shadow,
  shadowMedium,
  FOOD_ICONS,
  getTagStyle,
  card,
} from "../constants/theme";
import { SPRING_BOUNCE, SPRING_SNAPPY } from "../constants/animations";
import { useCartStore } from "../store/cartStore";

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MenuCard({ item, onAdd, index }: Props) {
  const inCartCount = useCartStore((s) =>
    s.cartItems
      .filter((c) => c.itemId === item.id)
      .reduce((sum, c) => sum + c.quantity, 0)
  );

  const cardScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const badgePop = useSharedValue(inCartCount > 0 ? 1 : 0);

  const foodIcon = FOOD_ICONS[item.id] ?? "🍽️";

  useEffect(() => {
    if (inCartCount > 0) {
      badgePop.value = withSequence(
        withSpring(1.4, SPRING_SNAPPY),
        withSpring(1, SPRING_BOUNCE)
      );
    } else {
      badgePop.value = withTiming(0, { duration: 200 });
    }
  }, [inCartCount]);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePop.value }],
    opacity: badgePop.value,
  }));

  function handlePressIn() {
    cardScale.value = withSpring(0.975, SPRING_SNAPPY);
  }

  function handlePressOut() {
    cardScale.value = withSpring(1, SPRING_BOUNCE);
  }

  function handleAdd() {
    buttonScale.value = withSequence(
      withSpring(0.85, SPRING_SNAPPY),
      withSpring(1, SPRING_BOUNCE)
    );
    onAdd(item);
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).duration(500).springify().damping(18)}
      style={[cardAnimStyle]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        {/* ─── Top: Icon + Content ─── */}
        <View style={styles.topSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.foodEmoji}>{foodIcon}</Text>
          </View>

          <View style={styles.contentArea}>
            <View style={styles.titleRow}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>

        {/* ─── Bottom: Tags + Price + CTA ─── */}
        <View style={styles.footer}>
          <View style={styles.tagsAndPrice}>
            <View style={styles.tagRow}>
              {item.tags.slice(0, 3).map((tag) => {
                const ts = getTagStyle(tag);
                return (
                  <View key={tag} style={[styles.tag, { backgroundColor: ts.bg }]}>
                    <Text style={[styles.tagText, { color: ts.text }]}>{tag}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>

          <AnimatedPressable
            onPress={handleAdd}
            style={[styles.addButton, buttonAnimStyle]}
          >
            {inCartCount > 0 && (
              <Animated.View style={[styles.badge, badgeAnimStyle]}>
                <Text style={styles.badgeText}>{inCartCount}</Text>
              </Animated.View>
            )}
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>Add</Text>
          </AnimatedPressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...shadow,
  },
  topSection: {
    flexDirection: "row",
    marginBottom: SPACING.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.warm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  foodEmoji: {
    fontSize: 28,
  },
  contentArea: {
    flex: 1,
    paddingTop: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.xs,
  },
  name: {
    ...TYPE.headlineMd,
    color: COLORS.dark,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  description: {
    ...TYPE.bodySm,
    color: COLORS.muted,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagsAndPrice: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  tagText: {
    ...TYPE.caption,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  price: {
    ...TYPE.priceLg,
    color: COLORS.accent,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.dark,
    paddingHorizontal: SPACING.lg + 2,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
    gap: 6,
    ...shadowMedium,
  },
  addIcon: {
    color: COLORS.accentLight,
    fontSize: 18,
    fontWeight: "700",
    marginTop: -1,
  },
  addText: {
    color: COLORS.white,
    ...TYPE.labelLg,
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
});
