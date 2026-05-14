import { create } from "zustand";
import { CartItem, CartSummary } from "../types/cart";

interface CartState {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  replaceCart: (items: CartItem[], summary: CartSummary) => void;
  clearCart: () => void;
}

const EMPTY_SUMMARY: CartSummary = { subtotal: 0, tax: 0, total: 0 };

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function recalcSummary(items: CartItem[]): CartSummary {
  const subtotal = round2(items.reduce((s, i) => s + i.lineTotal, 0));
  const tax = round2(subtotal * 0.09);
  return { subtotal, tax, total: round2(subtotal + tax) };
}

function modifierKey(item: CartItem) {
  const m = item.modifiers ?? {};
  return `${item.itemId}|${m.size ?? ""}|${m.spiceLevel ?? ""}|${m.notes ?? ""}`;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  cartSummary: EMPTY_SUMMARY,

  addItem: (incoming) => {
    const items = get().cartItems;
    const key = modifierKey(incoming);
    const existing = items.find((i) => modifierKey(i) === key);

    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) =>
        modifierKey(i) === key
          ? { ...i, quantity: i.quantity + incoming.quantity, lineTotal: round2(i.price * (i.quantity + incoming.quantity)) }
          : i
      );
    } else {
      updated = [...items, incoming];
    }

    set({ cartItems: updated, cartSummary: recalcSummary(updated) });
  },

  removeItem: (itemId) => {
    const updated = get().cartItems.filter((i) => i.itemId !== itemId);
    set({ cartItems: updated, cartSummary: recalcSummary(updated) });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    const updated = get().cartItems.map((i) =>
      i.itemId === itemId
        ? { ...i, quantity, lineTotal: round2(i.price * quantity) }
        : i
    );
    set({ cartItems: updated, cartSummary: recalcSummary(updated) });
  },

  replaceCart: (items, summary) => {
    set({ cartItems: items, cartSummary: summary });
  },

  clearCart: () => {
    set({ cartItems: [], cartSummary: EMPTY_SUMMARY });
  },
}));
