import { CartItem } from "../types/cart";
import { MenuItem } from "../types/menu";
import { round2 } from "./money";

/**
 * Ensures every cart item references a real menu item and
 * that lineTotal is recalculated server-side (never trust client math).
 */
export function validateAndRecalcCart(
  items: CartItem[],
  menu: MenuItem[]
): CartItem[] {
  const menuMap = new Map(menu.map((m) => [m.id, m]));

  return items
    .filter((item) => menuMap.has(item.itemId) && item.quantity > 0)
    .map((item) => {
      const menuItem = menuMap.get(item.itemId)!;
      return {
        ...item,
        name: menuItem.name,
        price: menuItem.price,
        lineTotal: round2(menuItem.price * item.quantity),
      };
    });
}
