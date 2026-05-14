import { CartItem, CartSummary } from "./cart";

export type Intent =
  | "update_cart"
  | "clarify"
  | "recommendation"
  | "menu_question"
  | "clear_cart"
  | "no_action";

export type ActionType = "add" | "remove" | "update_quantity" | "clear_cart";

export interface CartAction {
  type: ActionType;
  itemId: string;
  quantity?: number;
  modifiers?: {
    size?: "small" | "medium" | "large" | null;
    spiceLevel?: "mild" | "medium" | "spicy" | null;
    notes?: string | null;
  };
}

export interface ChatRequest {
  message: string;
  currentCart: CartItem[];
}

export interface ChatResponse {
  reply: string;
  intent: Intent;
  actions: CartAction[];
  updatedCart: CartItem[];
  cartSummary: CartSummary;
}
