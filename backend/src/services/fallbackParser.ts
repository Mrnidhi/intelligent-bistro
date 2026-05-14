import { CartItem } from "../types/cart";
import { CartAction } from "../types/chat";
import { ChatResponse, Intent } from "../types/chat";
import { applyActions, buildCartSummary } from "./cartService";
import { MenuItem } from "../types/menu";

// Simple regex-based parser so the app is demoable without an API key.
// Handles the most common demo phrases; not meant to be exhaustive.

const ID_ALIASES: Record<string, string> = {
  "spicy chicken": "spicy-chicken-sandwich",
  "chicken sandwich": "spicy-chicken-sandwich",
  sandwich: "spicy-chicken-sandwich",
  burger: "bistro-burger",
  "bistro burger": "bistro-burger",
  fries: "truffle-fries",
  "truffle fries": "truffle-fries",
  "caesar salad": "caesar-salad",
  salad: "caesar-salad",
  soup: "tomato-basil-soup",
  "tomato soup": "tomato-basil-soup",
  "sparkling water": "sparkling-water",
  "still water": "still-water",
  water: "still-water",
  cake: "chocolate-lava-cake",
  "lava cake": "chocolate-lava-cake",
  dessert: "chocolate-lava-cake",
};

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

function parseQuantity(text: string): number {
  const wordMatch = text.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i);
  if (wordMatch) return NUMBER_WORDS[wordMatch[1].toLowerCase()];
  const numMatch = text.match(/\b(\d+)\b/);
  if (numMatch) return parseInt(numMatch[1], 10);
  return 1;
}

function resolveItemId(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [alias, id] of Object.entries(ID_ALIASES)) {
    if (lower.includes(alias)) return id;
  }
  return null;
}

function extractMakeQuantityMatch(msg: string): { id: string; qty: number } | null {
  const match = msg.match(/make\s+(?:the\s+)?(.+?)\s+quantity\s+(\d+)/i);
  if (!match) return null;
  const id = resolveItemId(match[1]);
  if (!id) return null;
  return { id, qty: parseInt(match[2], 10) };
}

export function fallbackParse(
  message: string,
  currentCart: CartItem[],
  menu: MenuItem[]
): ChatResponse {
  const lower = message.toLowerCase().trim();

  // Clear cart
  if (lower.includes("clear") && (lower.includes("cart") || lower.includes("everything"))) {
    const updatedCart = applyActions(currentCart, [{ type: "clear_cart", itemId: "" }], menu);
    return {
      reply: "Done! Your cart has been cleared.",
      intent: "clear_cart",
      actions: [{ type: "clear_cart", itemId: "" }],
      updatedCart,
      cartSummary: buildCartSummary(updatedCart),
    };
  }

  // "make X quantity N"
  const makeQty = extractMakeQuantityMatch(lower);
  if (makeQty) {
    const action: CartAction = {
      type: "update_quantity",
      itemId: makeQty.id,
      quantity: makeQty.qty,
    };
    const updatedCart = applyActions(currentCart, [action], menu);
    const item = menu.find((m) => m.id === makeQty.id);
    return {
      reply: `Updated ${item?.name ?? makeQty.id} quantity to ${makeQty.qty}.`,
      intent: "update_cart",
      actions: [action],
      updatedCart,
      cartSummary: buildCartSummary(updatedCart),
    };
  }

  // Remove
  if (lower.startsWith("remove") || lower.startsWith("take out") || lower.startsWith("delete")) {
    const id = resolveItemId(lower);
    if (id) {
      const item = menu.find((m) => m.id === id);
      const action: CartAction = { type: "remove", itemId: id };
      const updatedCart = applyActions(currentCart, [action], menu);
      return {
        reply: `Removed ${item?.name ?? id} from your cart.`,
        intent: "update_cart",
        actions: [action],
        updatedCart,
        cartSummary: buildCartSummary(updatedCart),
      };
    }
  }

  // Add
  if (lower.startsWith("add") || lower.includes("i'd like") || lower.includes("i want")) {
    const id = resolveItemId(lower);
    if (id) {
      const qty = parseQuantity(lower);
      const item = menu.find((m) => m.id === id);
      const action: CartAction = { type: "add", itemId: id, quantity: qty };
      const updatedCart = applyActions(currentCart, [action], menu);
      return {
        reply: `Added ${qty > 1 ? qty + "x " : ""}${item?.name ?? id} to your cart.`,
        intent: "update_cart",
        actions: [action],
        updatedCart,
        cartSummary: buildCartSummary(updatedCart),
      };
    }
  }

  // Recommendations
  if (lower.includes("recommend") || lower.includes("suggest") || lower.includes("what's good")) {
    return {
      reply:
        "Our most popular items are the Spicy Chicken Sandwich and the Bistro Burger. The Truffle Fries are a great side. For dessert, don't miss the Chocolate Lava Cake!",
      intent: "recommendation",
      actions: [],
      updatedCart: currentCart,
      cartSummary: buildCartSummary(currentCart),
    };
  }

  return {
    reply:
      "I didn't quite catch that. Try saying something like \"Add two spicy chicken sandwiches\" or \"Remove the fries.\"",
    intent: "no_action",
    actions: [],
    updatedCart: currentCart,
    cartSummary: buildCartSummary(currentCart),
  };
}
