import { StyleSheet } from "react-native";

export const COLORS = {
  cream: "#FAF7F0",
  warm: "#F5EDD8",
  brown: "#8B6914",
  dark: "#2C1810",
  accent: "#C4822A",
  muted: "#9B8B7A",
  white: "#FFFFFF",
  border: "#E8DFD0",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  errorText: "#DC2626",
  successBg: "#F0FDF4",
  successBorder: "#BBF7D0",
  successText: "#15803D",
  successDot: "#4ADE80",
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  sandwich: "Sandwiches",
  burger: "Burgers",
  salad: "Salads",
  soup: "Soups",
  sides: "Sides",
  drinks: "Drinks",
  dessert: "Desserts",
};

export const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
};

export const card = StyleSheet.create({
  base: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...shadow,
  },
});
