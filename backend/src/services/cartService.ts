import { CartItem } from "../types/cart";
import { CartAction } from "../types/chat";
import { MenuItem } from "../types/menu";
import { round2, calcCartSummary } from "../utils/money";

function modifierKey(item: CartItem): string {
  const m = item.modifiers ?? {};
  return `${item.itemId}|${m.size ?? ""}|${m.spiceLevel ?? ""}|${m.notes ?? ""}`;
}

export function applyActions(
  currentCart: CartItem[],
  actions: CartAction[],
  menu: MenuItem[]
): CartItem[] {
  const menuMap = new Map(menu.map((m) => [m.id, m]));
  let cart = [...currentCart];

  for (const action of actions) {
    if (action.type === "clear_cart") {
      cart = [];
      continue;
    }

    const menuItem = menuMap.get(action.itemId);
    if (!menuItem) continue;

    if (action.type === "add") {
      const qty = action.quantity ?? 1;
      const incoming: CartItem = {
        itemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: qty,
        modifiers: action.modifiers ?? {},
        lineTotal: round2(menuItem.price * qty),
      };
      const key = modifierKey(incoming);
      const existing = cart.find((c) => modifierKey(c) === key);
      if (existing) {
        existing.quantity += qty;
        existing.lineTotal = round2(existing.price * existing.quantity);
      } else {
        cart.push(incoming);
      }
    } else if (action.type === "remove") {
      cart = cart.filter((c) => c.itemId !== action.itemId);
    } else if (action.type === "update_quantity") {
      const qty = action.quantity ?? 1;
      const item = cart.find((c) => c.itemId === action.itemId);
      if (item) {
        if (qty <= 0) {
          cart = cart.filter((c) => c.itemId !== action.itemId);
        } else {
          item.quantity = qty;
          item.lineTotal = round2(item.price * qty);
        }
      }
    }
  }

  return cart;
}

export function buildCartSummary(cart: CartItem[]) {
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  return calcCartSummary(subtotal);
}
