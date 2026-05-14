import { CartItem, CartSummary } from "./cart";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface ChatResponse {
  reply: string;
  intent: string;
  actions: unknown[];
  updatedCart: CartItem[];
  cartSummary: CartSummary;
}
