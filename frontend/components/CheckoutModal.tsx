import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useCartStore } from "../store/cartStore";
import { PriceRow } from "./PriceRow";
import { COLORS } from "../constants/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Stage = "review" | "placing" | "success";

function generateOrderNumber() {
  return `BIS-${Math.floor(Math.random() * 90000 + 10000)}`;
}

export function CheckoutModal({ visible, onClose }: Props) {
  const cartItems = useCartStore((s) => s.cartItems);
  const cartSummary = useCartStore((s) => s.cartSummary);
  const clearCart = useCartStore((s) => s.clearCart);

  const [stage, setStage] = useState<Stage>("review");
  const [orderNumber, setOrderNumber] = useState<string>("");

  function handleClose() {
    setStage("review");
    setOrderNumber("");
    onClose();
  }

  function handlePlaceOrder() {
    setStage("placing");
    // Simulate kitchen handoff — in a real app this would POST to /orders
    setTimeout(() => {
      setOrderNumber(generateOrderNumber());
      setStage("success");
      clearCart();
    }, 1200);
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>
            {stage === "success" ? "Order Confirmed" : "Review Order"}
          </Text>
          <Pressable onPress={handleClose} hitSlop={12}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {stage === "review" && (
          <>
            <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.sectionLabel}>ITEMS</Text>
              {cartItems.map((item) => (
                <View
                  key={`${item.itemId}-${JSON.stringify(item.modifiers)}`}
                  style={styles.lineRow}
                >
                  <View style={styles.lineLeft}>
                    <Text style={styles.lineQty}>{item.quantity}×</Text>
                    <Text style={styles.lineName} numberOfLines={1}>{item.name}</Text>
                  </View>
                  <Text style={styles.lineTotal}>${item.lineTotal.toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.summaryCard}>
                <PriceRow label="Subtotal" value={cartSummary.subtotal} />
                <PriceRow label="Tax (9%)" value={cartSummary.tax} />
                <View style={styles.divider} />
                <PriceRow label="Total" value={cartSummary.total} bold />
              </View>

              <Text style={styles.disclaimer}>
                This is a demo checkout. No payment will be charged.
              </Text>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                onPress={handlePlaceOrder}
                style={styles.placeButton}
              >
                <Text style={styles.placeButtonText}>
                  Place Order • ${cartSummary.total.toFixed(2)}
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {stage === "placing" && (
          <View style={styles.centerStage}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.placingText}>Sending to the kitchen...</Text>
          </View>
        )}

        {stage === "success" && (
          <View style={styles.centerStage}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>Order placed!</Text>
            <Text style={styles.successSubtitle}>
              Order #{orderNumber} — we'll start preparing it right away.
            </Text>

            <Pressable onPress={handleClose} style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
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
  closeText: { fontSize: 22, color: COLORS.muted, paddingHorizontal: 4 },
  scroll: { flex: 1 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  lineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lineLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
  lineQty: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.accent,
    width: 32,
  },
  lineName: { flex: 1, fontSize: 14, color: COLORS.dark, paddingRight: 8 },
  lineTotal: { fontSize: 14, fontWeight: "600", color: COLORS.dark },
  summaryCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginVertical: 8,
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  placeButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  placeButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
  centerStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  placingText: {
    marginTop: 16,
    fontSize: 15,
    color: COLORS.muted,
  },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
  },
  doneButton: {
    marginTop: 32,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 14,
  },
  doneButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
});
