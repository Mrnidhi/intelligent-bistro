import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useCartStore } from "../store/cartStore";
import { CartItemRow } from "./CartItemRow";
import { PriceRow } from "./PriceRow";
import { COLORS } from "../constants/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartModal({ visible, onClose, onCheckout }: Props) {
  const cartItems = useCartStore((s) => s.cartItems);
  const cartSummary = useCartStore((s) => s.cartSummary);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.headerTitle}>Your Cart</Text>
            {cartItems.length > 0 && (
              <Text style={styles.headerSubtitle}>{totalItems} items</Text>
            )}
          </View>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Browse the menu or ask the AI to add something
            </Text>
          </View>
        ) : (
          <>
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {cartItems.map((item) => (
                <CartItemRow
                  key={`${item.itemId}-${JSON.stringify(item.modifiers)}`}
                  item={item}
                  onRemove={removeItem}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <PriceRow label="Subtotal" value={cartSummary.subtotal} />
              <PriceRow label="Tax (9%)" value={cartSummary.tax} />
              <View style={styles.divider} />
              <PriceRow label="Total" value={cartSummary.total} bold />

              <Pressable onPress={onCheckout} style={styles.checkoutButton}>
                <Text style={styles.checkoutText}>
                  Checkout • ${cartSummary.total.toFixed(2)}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: COLORS.dark },
  headerSubtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  closeText: { fontSize: 22, color: COLORS.muted, paddingHorizontal: 4 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: "600", color: COLORS.dark },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
    textAlign: "center",
  },
  scroll: { flex: 1 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginVertical: 8,
  },
  checkoutButton: {
    marginTop: 14,
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  checkoutText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
});
