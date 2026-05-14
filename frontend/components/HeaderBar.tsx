import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useCartStore } from "../store/cartStore";
import { COLORS } from "../constants/theme";

interface Props {
  onCartPress: () => void;
}

export function HeaderBar({ onCartPress }: Props) {
  const totalItems = useCartStore((s) =>
    s.cartItems.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>The Intelligent Bistro</Text>
        <Text style={styles.tagline}>Order naturally — just say what you want</Text>
      </View>

      <Pressable onPress={onCartPress} style={styles.cartButton} hitSlop={8}>
        <Text style={styles.cartIcon}>🛒</Text>
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems > 99 ? "99+" : totalItems}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  left: { flex: 1, paddingRight: 12 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 2,
  },
  tagline: { fontSize: 13, color: COLORS.muted },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cartIcon: { fontSize: 22 },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },
});
