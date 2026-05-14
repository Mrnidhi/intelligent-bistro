import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  FadeIn,
  FadeInDown,
  FadeInRight,
  Easing,
} from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MenuItem } from "./types/menu";
import { CartItem } from "./types/cart";
import { fetchMenu } from "./services/api";
import { useCartStore } from "./store/cartStore";
import { CategoryPill } from "./components/CategoryPill";
import { MenuCard } from "./components/MenuCard";
import { HeaderBar } from "./components/HeaderBar";
import { CartModal } from "./components/CartModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { AIChatSheet } from "./components/AIChatSheet";
import { AskAIButton } from "./components/AskAIButton";
import {
  CATEGORY_LABELS,
  COLORS,
  TYPE,
  SPACING,
  RADIUS,
  shadow,
  shadowMedium,
} from "./constants/theme";

type Category =
  | "all" | "sandwich" | "burger" | "salad"
  | "soup" | "sides" | "drinks" | "dessert";

const CATEGORIES: Category[] = [
  "all", "sandwich", "burger", "salad", "soup", "sides", "drinks", "dessert",
];

/* ─── AI Suggestion chips ─── */
const AI_SUGGESTIONS = [
  { emoji: "🔥", label: "Popular tonight", query: "What's popular tonight?" },
  { emoji: "🌶️", label: "Spicy lovers", query: "Recommend something spicy" },
  { emoji: "🥗", label: "Light & fresh", query: "Something light and fresh" },
  { emoji: "🍫", label: "Sweet tooth", query: "I want dessert" },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <BistroScreen />
    </SafeAreaProvider>
  );
}

/* ─── Shimmer loading placeholder ─── */
function ShimmerCard({ index }: { index: number }) {
  const shimmer = useSharedValue(0.3);

  useEffect(() => {
    shimmer.value = withDelay(
      index * 120,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <Animated.View style={[styles.shimmerCard, shimmerStyle]}>
      <View style={styles.shimmerRow}>
        <View style={styles.shimmerIcon} />
        <View style={styles.shimmerLines}>
          <View style={[styles.shimmerLine, { width: "70%" }]} />
          <View style={[styles.shimmerLine, { width: "90%", marginTop: 8 }]} />
          <View style={[styles.shimmerLine, { width: "50%", marginTop: 8 }]} />
        </View>
      </View>
    </Animated.View>
  );
}

function BistroScreen() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // Close the cart first, then open checkout once the cart's slide-out
  // animation has settled. Avoids iOS Modal stacking glitches.
  function openCheckout() {
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 350);
  }

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch(() => setMenuError(true))
      .finally(() => setMenuLoading(false));
  }, []);

  function handleAddItem(item: MenuItem) {
    const cartItem: CartItem = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      modifiers: {},
      lineTotal: item.price,
    };
    addItem(cartItem);
  }

  const filteredMenu =
    activeCategory === "all"
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  /* ─── AI Status dot pulse ─── */
  const dotPulse = useSharedValue(1);
  useEffect(() => {
    dotPulse.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotPulse.value }],
  }));

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <HeaderBar onCartPress={() => setCartOpen(true)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── AI Status Pill ─── */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500).springify()}
          style={styles.statusRow}
        >
          <View style={styles.statusPill}>
            <Animated.View style={[styles.statusDot, dotStyle]} />
            <Text style={styles.statusText}>AI Online</Text>
          </View>
        </Animated.View>

        {/* ─── AI Suggestions Row ─── */}
        <Animated.View entering={FadeInDown.delay(400).duration(500).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsRow}
            contentContainerStyle={{
              paddingLeft: SPACING.xl,
              paddingRight: SPACING.xl,
            }}
          >
            {AI_SUGGESTIONS.map((sug, i) => (
              <Pressable
                key={sug.label}
                onPress={() => setAiOpen(true)}
                style={styles.aiSuggestionChip}
              >
                <Text style={styles.aiSuggestionEmoji}>{sug.emoji}</Text>
                <Text style={styles.aiSuggestionText}>{sug.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ─── Category Pills ─── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillRow}
          contentContainerStyle={{
            paddingLeft: SPACING.xl,
            paddingRight: SPACING.xl,
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryPill
              key={cat}
              label={CATEGORY_LABELS[cat]}
              categoryKey={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
              index={i}
            />
          ))}
        </ScrollView>

        {/* ─── Menu Section ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>MENU</Text>
            <Text style={styles.itemCount}>
              {filteredMenu.length} {filteredMenu.length === 1 ? "item" : "items"}
            </Text>
          </View>

          {/* Loading shimmer */}
          {menuLoading && (
            <View>
              {[0, 1, 2, 3].map((i) => (
                <ShimmerCard key={i} index={i} />
              ))}
            </View>
          )}

          {/* Error state */}
          {menuError && (
            <Animated.View
              entering={FadeInDown.duration(500).springify()}
              style={styles.errorBlock}
            >
              <View style={styles.errorIconWrap}>
                <Text style={styles.errorEmoji}>⚠️</Text>
              </View>
              <Text style={styles.errorTitle}>Couldn't load the menu</Text>
              <Text style={styles.errorSubtitle}>
                Make sure the backend is running on port 4000
              </Text>
            </Animated.View>
          )}

          {/* Empty state */}
          {!menuLoading && !menuError && filteredMenu.length === 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).springify()}
              style={styles.emptyBlock}
            >
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyText}>No items in this category</Text>
            </Animated.View>
          )}

          {/* Menu cards */}
          {!menuLoading &&
            !menuError &&
            filteredMenu.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={handleAddItem}
                index={index}
              />
            ))}
        </View>
      </ScrollView>

      <AskAIButton onPress={() => setAiOpen(true)} />

      <CartModal
        visible={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={openCheckout}
      />
      <CheckoutModal
        visible={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
      <AIChatSheet visible={aiOpen} onClose={() => setAiOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: {
    flex: 1,
  },

  /* AI Status */
  statusRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.successDot,
    marginRight: 7,
  },
  statusText: {
    ...TYPE.labelSm,
    color: COLORS.successText,
    fontWeight: "600",
  },

  /* AI Suggestion chips */
  suggestionsRow: {
    marginBottom: SPACING.lg,
  },
  aiSuggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accentGlow,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    gap: 6,
  },
  aiSuggestionEmoji: {
    fontSize: 14,
  },
  aiSuggestionText: {
    ...TYPE.labelSm,
    color: COLORS.accentDark,
    fontWeight: "600",
  },

  /* Category pills row */
  pillRow: {
    marginBottom: SPACING.xl,
  },

  /* Menu section */
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    ...TYPE.labelMd,
    color: COLORS.muted,
  },
  itemCount: {
    ...TYPE.labelSm,
    color: COLORS.mutedSoft,
  },

  /* Shimmer loading */
  shimmerCard: {
    backgroundColor: COLORS.warm,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  shimmerRow: {
    flexDirection: "row",
  },
  shimmerIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.warmSoft,
    marginRight: SPACING.md,
  },
  shimmerLines: {
    flex: 1,
    justifyContent: "center",
  },
  shimmerLine: {
    height: 12,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.warmSoft,
  },

  /* States */
  emptyBlock: {
    paddingVertical: SPACING.xxxl + 8,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: SPACING.md,
  },
  emptyText: {
    ...TYPE.bodyMd,
    color: COLORS.muted,
  },
  errorBlock: {
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  errorIconWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  errorEmoji: {
    fontSize: 28,
  },
  errorTitle: {
    ...TYPE.headlineMd,
    color: COLORS.errorText,
    marginBottom: SPACING.xs,
  },
  errorSubtitle: {
    ...TYPE.bodySm,
    color: COLORS.errorText,
    textAlign: "center",
  },
});
