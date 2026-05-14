import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
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
import { CATEGORY_LABELS, COLORS } from "./constants/theme";

type Category =
  | "all" | "sandwich" | "burger" | "salad"
  | "soup" | "sides" | "drinks" | "dessert";

const CATEGORIES: Category[] = [
  "all", "sandwich", "burger", "salad", "soup", "sides", "drinks", "dessert",
];

export default function App() {
  return (
    <SafeAreaProvider>
      <BistroScreen />
    </SafeAreaProvider>
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

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <HeaderBar onCartPress={() => setCartOpen(true)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>AI Online</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillRow}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={CATEGORY_LABELS[cat]}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MENU</Text>

          {menuLoading && (
            <View style={styles.centerBlock}>
              <ActivityIndicator color={COLORS.accent} />
              <Text style={styles.loadingText}>Loading menu...</Text>
            </View>
          )}

          {menuError && (
            <View style={styles.errorBlock}>
              <Text style={styles.errorTitle}>Couldn't load the menu.</Text>
              <Text style={styles.errorSubtitle}>
                Make sure the backend is running on port 4000.
              </Text>
            </View>
          )}

          {!menuLoading && !menuError && filteredMenu.length === 0 && (
            <View style={styles.centerBlock}>
              <Text style={styles.loadingText}>No items in this category.</Text>
            </View>
          )}

          {!menuLoading &&
            !menuError &&
            filteredMenu.map((item) => (
              <MenuCard key={item.id} item={item} onAdd={handleAddItem} />
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
  safe: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { flex: 1 },
  statusRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.successDot,
    marginRight: 6,
  },
  statusText: { fontSize: 12, fontWeight: "500", color: COLORS.successText },
  pillRow: { marginBottom: 12 },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  centerBlock: { paddingVertical: 40, alignItems: "center" },
  loadingText: { fontSize: 14, color: COLORS.muted, marginTop: 8 },
  errorBlock: {
    paddingVertical: 32,
    alignItems: "center",
    backgroundColor: COLORS.errorBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  errorTitle: { fontSize: 14, color: COLORS.errorText },
  errorSubtitle: { fontSize: 12, color: COLORS.errorText, marginTop: 4 },
});
