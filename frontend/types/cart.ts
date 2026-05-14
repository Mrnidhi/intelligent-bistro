export interface CartItemModifiers {
  size?: "small" | "medium" | "large" | null;
  spiceLevel?: "mild" | "medium" | "spicy" | null;
  notes?: string | null;
}

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: CartItemModifiers;
  lineTotal: number;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
}
