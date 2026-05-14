import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MenuItem } from "../types/menu";
import { COLORS, card } from "../constants/theme";
import { useCartStore } from "../store/cartStore";

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export function MenuCard({ item, onAdd }: Props) {
  // Sum quantities across all cart lines for this menu item (modifiers may split lines)
  const inCartCount = useCartStore((s) =>
    s.cartItems.filter((c) => c.itemId === item.id).reduce((sum, c) => sum + c.quantity, 0)
  );

  return (
    <View style={[card.base, styles.card]}>
      <View style={styles.headerRow}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.tagRow}>
          {item.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => onAdd(item)} style={styles.addButton}>
          {inCartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{inCartCount}</Text>
            </View>
          )}
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, marginBottom: 12 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  name: {
    flex: 1,
    paddingRight: 8,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.accent,
  },
  description: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: COLORS.warm,
  },
  tagText: { fontSize: 12, color: COLORS.brown },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: "700",
  },
  addText: { color: COLORS.white, fontSize: 14, fontWeight: "600" },
});
