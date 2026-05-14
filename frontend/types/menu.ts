export interface MenuItemModifiers {
  size?: Array<"small" | "medium" | "large">;
  spiceLevel?: Array<"mild" | "medium" | "spicy">;
  notes?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "sandwich" | "burger" | "salad" | "soup" | "sides" | "drinks" | "dessert";
  price: number;
  description: string;
  tags: string[];
  availableModifiers: MenuItemModifiers;
}
