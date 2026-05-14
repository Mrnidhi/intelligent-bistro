import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeInDown,
} from "react-native-reanimated";
import { useCartStore } from "../store/cartStore";
import { CartItemRow } from "./CartItemRow";
import { PriceRow } from "./PriceRow";
import { COLORS, TYPE, SPACING, RADIUS, shadow, shadowMedium } from "../constants/theme";
import { SPRING_BOUNCE, SPRING_SNAPPY } from "../constants/animations";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CartModal({ visible, onClose, onCheckout }: Props) {
  const cartItems = useCartStore((s) => s.cartItems);
  const cartSummary = useCartStore((s) => s.cartSummary);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const checkoutScale = useSharedValue(1);

  const checkoutStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkoutScale.value }],
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* ─── Header ─── */}
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.headerTitle}>Your Cart</Text>
            {cartItems.length > 0 && (
              <Text style={styles.headerSubtitle}>
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </Text>
            )}
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Browse the menu or ask the AI assistant to add items for you
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={{ paddingHorizontal: SPACING.xl }}
              showsVerticalScrollIndicator={false}
            >
              {cartItems.map((item) => (
                <CartItemRow
                  key={`${item.itemId}-${JSON.stringify(item.modifiers)}`}
                  item={item}
                  onRemove={removeItem}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </ScrollView>

            {/* ─── Footer summary ─── */}
            <View style={styles.footer}>
              <View style={styles.summaryBlock}>
                <PriceRow label="Subtotal" value={cartSummary.subtotal} />
                <PriceRow label="Tax (9%)" value={cartSummary.tax} />
                <View style={styles.divider} />
                <PriceRow label="Total" value={cartSummary.total} bold />
              </View>

              <AnimatedPressable
                onPress={() => {
                  checkoutScale.value = withSequence(
                    withSpring(0.95, SPRING_SNAPPY),
                    withSpring(1, SPRING_BOUNCE)
                  );
                  onCheckout();
                }}
                style={[styles.checkoutButton, checkoutStyle]}
              >
                <Text style={styles.checkoutText}>
                  Checkout · ${cartSummary.total.toFixed(2)}
                </Text>
              </AnimatedPressable>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  /* Header */
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    ...TYPE.headlineLg,
    color: COLORS.dark,
  },
  headerSubtitle: {
    ...TYPE.labelSm,
    color: COLORS.muted,
    marginTop: 3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.warm,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 18,
    color: COLORS.muted,
  },

  /* Empty state */
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xxxl,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.warm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: {
    ...TYPE.headlineMd,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPE.bodyMd,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
  },

  /* Content */
  scroll: { flex: 1 },

  /* Footer */
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
  },
  summaryBlock: {
    marginBottom: SPACING.lg,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  checkoutButton: {
    backgroundColor: COLORS.dark,
    paddingVertical: SPACING.lg + 2,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    ...shadowMedium,
  },
  checkoutText: {
    color: COLORS.white,
    ...TYPE.headlineMd,
  },
});
