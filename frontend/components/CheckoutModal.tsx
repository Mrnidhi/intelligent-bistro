import React, { useState, useEffect } from "react";
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
  withTiming,
  withDelay,
  withRepeat,
  FadeIn,
  FadeInDown,
  Easing,
} from "react-native-reanimated";
import { useCartStore } from "../store/cartStore";
import { PriceRow } from "./PriceRow";
import { COLORS, TYPE, SPACING, RADIUS, shadow, shadowMedium } from "../constants/theme";
import { SPRING_BOUNCE, SPRING_SNAPPY } from "../constants/animations";

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Stage = "review" | "placing" | "success";

function generateOrderNumber() {
  return `BIS-${Math.floor(Math.random() * 90000 + 10000)}`;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/* ─── Loading spinner animation ─── */
function PlacingAnimation() {
  const spin = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${spin.value}deg` },
      { scale: pulse.value },
    ],
  }));

  return (
    <View style={styles.centerStage}>
      <Animated.View style={[styles.spinner, spinStyle]}>
        <Text style={styles.spinnerEmoji}>🍳</Text>
      </Animated.View>
      <Text style={styles.placingTitle}>Sending to the kitchen...</Text>
      <Text style={styles.placingSubtitle}>
        This will only take a moment
      </Text>
    </View>
  );
}

/* ─── Success animation ─── */
function SuccessView({
  orderNumber,
  onClose,
}: {
  orderNumber: string;
  onClose: () => void;
}) {
  const emojiScale = useSharedValue(0);
  const doneScale = useSharedValue(1);

  useEffect(() => {
    emojiScale.value = withDelay(
      100,
      withSpring(1, { damping: 10, stiffness: 140 })
    );
  }, []);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const doneStyle = useAnimatedStyle(() => ({
    transform: [{ scale: doneScale.value }],
  }));

  return (
    <View style={styles.centerStage}>
      <Animated.View style={[styles.successIconWrap, emojiStyle]}>
        <Text style={styles.successEmoji}>🎉</Text>
      </Animated.View>
      <Animated.Text
        entering={FadeInDown.delay(200).duration(400).springify()}
        style={styles.successTitle}
      >
        Order placed!
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(350).duration(400).springify()}
        style={styles.successSubtitle}
      >
        Order #{orderNumber} — we'll start preparing it right away.
      </Animated.Text>

      <AnimatedPressable
        onPress={() => {
          doneScale.value = withSequence(
            withSpring(0.93, SPRING_SNAPPY),
            withSpring(1, SPRING_BOUNCE)
          );
          setTimeout(onClose, 200);
        }}
        style={[styles.doneButton, doneStyle]}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </AnimatedPressable>
    </View>
  );
}

export function CheckoutModal({ visible, onClose }: Props) {
  const cartItems = useCartStore((s) => s.cartItems);
  const cartSummary = useCartStore((s) => s.cartSummary);
  const clearCart = useCartStore((s) => s.clearCart);

  const [stage, setStage] = useState<Stage>("review");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const placeScale = useSharedValue(1);

  function handleClose() {
    setStage("review");
    setOrderNumber("");
    onClose();
  }

  function handlePlaceOrder() {
    placeScale.value = withSequence(
      withSpring(0.95, SPRING_SNAPPY),
      withSpring(1, SPRING_BOUNCE)
    );
    setStage("placing");
    // Simulate kitchen handoff — in a real app this would POST to /orders
    setTimeout(() => {
      setOrderNumber(generateOrderNumber());
      setStage("success");
      clearCart();
    }, 1500);
  }

  const placeBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: placeScale.value }],
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* ─── Header ─── */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>
            {stage === "success" ? "Order Confirmed" : "Review Order"}
          </Text>
          <Pressable
            onPress={handleClose}
            hitSlop={12}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {/* ─── Review stage ─── */}
        {stage === "review" && (
          <>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={{ padding: SPACING.xl }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionLabel}>ORDER ITEMS</Text>
              {cartItems.map((item, i) => (
                <Animated.View
                  key={`${item.itemId}-${JSON.stringify(item.modifiers)}`}
                  entering={FadeInDown.delay(i * 60).duration(400).springify()}
                  style={styles.lineRow}
                >
                  <View style={styles.lineLeft}>
                    <View style={styles.qtyBadge}>
                      <Text style={styles.lineQty}>{item.quantity}×</Text>
                    </View>
                    <Text style={styles.lineName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={styles.lineTotal}>
                    ${item.lineTotal.toFixed(2)}
                  </Text>
                </Animated.View>
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
              <AnimatedPressable
                onPress={handlePlaceOrder}
                style={[styles.placeButton, placeBtnStyle]}
              >
                <Text style={styles.placeButtonText}>
                  Place Order · ${cartSummary.total.toFixed(2)}
                </Text>
              </AnimatedPressable>
            </View>
          </>
        )}

        {/* ─── Placing stage ─── */}
        {stage === "placing" && <PlacingAnimation />}

        {/* ─── Success stage ─── */}
        {stage === "success" && (
          <SuccessView orderNumber={orderNumber} onClose={handleClose} />
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

  /* Content */
  scroll: { flex: 1 },
  sectionLabel: {
    ...TYPE.labelMd,
    color: COLORS.muted,
    marginBottom: SPACING.lg,
  },
  lineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  lineLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
  qtyBadge: {
    width: 36,
    height: 24,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  lineQty: {
    ...TYPE.labelLg,
    color: COLORS.accent,
  },
  lineName: {
    flex: 1,
    ...TYPE.bodyMd,
    color: COLORS.dark,
    paddingRight: SPACING.sm,
    fontWeight: "500",
  },
  lineTotal: {
    ...TYPE.labelLg,
    color: COLORS.dark,
  },
  summaryCard: {
    marginTop: SPACING.xxl,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...shadow,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  disclaimer: {
    marginTop: SPACING.xl,
    ...TYPE.labelSm,
    color: COLORS.mutedSoft,
    textAlign: "center",
    fontStyle: "italic",
  },

  /* Footer */
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
  },
  placeButton: {
    backgroundColor: COLORS.dark,
    paddingVertical: SPACING.lg + 2,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    ...shadowMedium,
  },
  placeButtonText: {
    color: COLORS.white,
    ...TYPE.headlineMd,
  },

  /* Center stage (placing / success) */
  centerStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxxl,
  },
  spinner: {
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
  spinnerEmoji: { fontSize: 36 },
  placingTitle: {
    ...TYPE.headlineMd,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  placingSubtitle: {
    ...TYPE.bodySm,
    color: COLORS.muted,
  },

  /* Success */
  successIconWrap: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.xxxl,
    backgroundColor: COLORS.successBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
  },
  successEmoji: { fontSize: 44 },
  successTitle: {
    ...TYPE.displayMd,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  successSubtitle: {
    ...TYPE.bodyLg,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 24,
  },
  doneButton: {
    marginTop: SPACING.xxxl,
    backgroundColor: COLORS.dark,
    paddingHorizontal: 56,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...shadowMedium,
  },
  doneButtonText: {
    color: COLORS.white,
    ...TYPE.headlineMd,
  },
});
