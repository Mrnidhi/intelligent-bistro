export interface MenuItemModifiers {
  size?: "small" | "medium" | "large" | null;
  spiceLevel?: "mild" | "medium" | "spicy" | null;
  notes?: string | null;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "sandwich" | "burger" | "salad" | "soup" | "sides" | "drinks" | "dessert";
  price: number;
  description: string;
  tags: string[];
  availableModifiers: {
    size?: Array<"small" | "medium" | "large">;
    spiceLevel?: Array<"mild" | "medium" | "spicy">;
    notes?: boolean;
  };
}
