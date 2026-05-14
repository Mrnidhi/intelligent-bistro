import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { CartItem } from "../types/cart";
import { COLORS } from "../constants/theme";

interface Props {
  item: CartItem;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export function CartItemRow({ item, onRemove, onQuantityChange }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {item.modifiers?.notes && (
          <Text style={styles.note}>Note: {item.modifiers.notes}</Text>
        )}
        <Text style={styles.price}>${item.price.toFixed(2)} each</Text>
      </View>

      <View style={styles.qtyGroup}>
        <Pressable
          onPress={() => onQuantityChange(item.itemId, item.quantity - 1)}
          style={styles.qtyButton}
        >
          <Text style={styles.qtyButtonText}>−</Text>
        </Pressable>

        <Text style={styles.qty}>{item.quantity}</Text>

        <Pressable
          onPress={() => onQuantityChange(item.itemId, item.quantity + 1)}
          style={styles.qtyButton}
        >
          <Text style={styles.qtyButtonText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.right}>
        <Text style={styles.total}>${item.lineTotal.toFixed(2)}</Text>
        <Pressable onPress={() => onRemove(item.itemId)}>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600", color: COLORS.dark },
  note: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  price: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  qtyGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: COLORS.warm,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    color: COLORS.brown,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 18,
  },
  qty: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
    width: 16,
    textAlign: "center",
  },
  right: { alignItems: "flex-end" },
  total: { fontSize: 14, fontWeight: "700", color: COLORS.dark },
  removeText: { fontSize: 12, color: "#EF4444", marginTop: 4 },
});
