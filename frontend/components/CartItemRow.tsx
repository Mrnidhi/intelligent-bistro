import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { CartItem } from "../types/cart";
import { COLORS, TYPE, SPACING, RADIUS } from "../constants/theme";
import { SPRING_BOUNCE, SPRING_SNAPPY } from "../constants/animations";

interface Props {
  item: CartItem;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CartItemRow({ item, onRemove, onQuantityChange }: Props) {
  const minusScale = useSharedValue(1);
  const plusScale = useSharedValue(1);

  const minusStyle = useAnimatedStyle(() => ({
    transform: [{ scale: minusScale.value }],
  }));
  const plusStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  function tapAnim(sv: Animated.SharedValue<number>) {
    sv.value = withSequence(
      withSpring(0.8, SPRING_SNAPPY),
      withSpring(1, SPRING_BOUNCE)
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {item.modifiers?.notes && (
          <Text style={styles.note}>📝 {item.modifiers.notes}</Text>
        )}
        <Text style={styles.price}>${item.price.toFixed(2)} each</Text>
      </View>

      <View style={styles.qtyGroup}>
        <AnimatedPressable
          onPress={() => {
            tapAnim(minusScale);
            onQuantityChange(item.itemId, item.quantity - 1);
          }}
          style={[styles.qtyButton, minusStyle]}
        >
          <Text style={styles.qtyButtonText}>−</Text>
        </AnimatedPressable>

        <Text style={styles.qty}>{item.quantity}</Text>

        <AnimatedPressable
          onPress={() => {
            tapAnim(plusScale);
            onQuantityChange(item.itemId, item.quantity + 1);
          }}
          style={[styles.qtyButton, styles.qtyButtonPlus, plusStyle]}
        >
          <Text style={[styles.qtyButtonText, styles.qtyButtonPlusText]}>
            +
          </Text>
        </AnimatedPressable>
      </View>

      <View style={styles.right}>
        <Text style={styles.total}>${item.lineTotal.toFixed(2)}</Text>
        <Pressable
          onPress={() => onRemove(item.itemId)}
          style={styles.removeBtn}
        >
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  info: { flex: 1 },
  name: {
    ...TYPE.labelLg,
    color: COLORS.dark,
  },
  note: {
    ...TYPE.labelSm,
    color: COLORS.muted,
    marginTop: 3,
  },
  price: {
    ...TYPE.labelSm,
    color: COLORS.mutedSoft,
    marginTop: 3,
  },
  qtyGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.warm,
    borderRadius: RADIUS.lg,
    padding: 3,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonPlus: {
    backgroundColor: COLORS.dark,
  },
  qtyButtonText: {
    color: COLORS.dark,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 18,
  },
  qtyButtonPlusText: {
    color: COLORS.white,
  },
  qty: {
    marginHorizontal: SPACING.md,
    ...TYPE.labelLg,
    color: COLORS.dark,
    width: 20,
    textAlign: "center",
  },
  right: { alignItems: "flex-end" },
  total: {
    ...TYPE.priceMd,
    color: COLORS.dark,
  },
  removeBtn: {
    marginTop: SPACING.xs,
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  removeText: {
    ...TYPE.labelSm,
    color: COLORS.errorText,
  },
});
