import { StyleSheet, Platform } from "react-native";

/* ─── Premium Color Palette ─── */
export const COLORS = {
  /* Base surfaces */
  cream:        "#FBF8F1",
  creamSoft:    "#F7F3EA",
  warm:         "#F0EAD6",
  warmSoft:     "#EDE5CE",

  /* Text */
  dark:         "#1F1408",
  darkSoft:     "#3B2A14",
  brown:        "#6B4F2E",
  muted:        "#9B8B7A",
  mutedSoft:    "#BDB0A0",

  /* Accent – rich amber/gold */
  accent:       "#C08B3E",
  accentDark:   "#A0712E",
  accentLight:  "#E8C97A",
  accentGlow:   "rgba(192, 139, 62, 0.18)",

  /* Surfaces */
  white:        "#FFFFFF",
  card:         "#FFFFFF",
  cardHover:    "#FDFCF9",
  overlay:      "rgba(31, 20, 8, 0.50)",
  glass:        "rgba(255, 255, 255, 0.75)",
  glassBorder:  "rgba(255, 255, 255, 0.35)",

  /* Borders */
  border:       "#E8DFD0",
  borderLight:  "#F0E9DC",
  borderSoft:   "rgba(232, 223, 208, 0.6)",

  /* Status */
  errorBg:      "#FEF2F2",
  errorBorder:  "#FECACA",
  errorText:    "#DC2626",
  successBg:    "#F0FDF4",
  successBorder:"#BBF7D0",
  successText:  "#15803D",
  successDot:   "#4ADE80",

  /* AI Theme */
  aiBg:         "rgba(192, 139, 62, 0.08)",
  aiGlow:       "rgba(192, 139, 62, 0.25)",
  aiPulse:      "rgba(192, 139, 62, 0.40)",

  /* Badge colors */
  spicyBg:      "#FEF3C7",
  spicyText:    "#B45309",
  popularBg:    "#FEE2E2",
  popularText:  "#DC2626",
  vegBg:        "#ECFDF5",
  vegText:      "#059669",
  drinkBg:      "#EFF6FF",
  drinkText:    "#2563EB",
} as const;

/* ─── Category Emojis & Labels ─── */
export const CATEGORY_LABELS: Record<string, string> = {
  all:       "All",
  sandwich:  "Sandwiches",
  burger:    "Burgers",
  salad:     "Salads",
  soup:      "Soups",
  sides:     "Sides",
  drinks:    "Drinks",
  dessert:   "Desserts",
};

export const CATEGORY_ICONS: Record<string, string> = {
  all:       "🍽️",
  sandwich:  "🥪",
  burger:    "🍔",
  salad:     "🥗",
  soup:      "🍲",
  sides:     "🍟",
  drinks:    "🥤",
  dessert:   "🍰",
};

/* ─── Food Item Icons (based on ID) ─── */
export const FOOD_ICONS: Record<string, string> = {
  "spicy-chicken-sandwich": "🌶️",
  "bistro-burger":          "🍔",
  "truffle-fries":          "🍟",
  "caesar-salad":           "🥗",
  "tomato-basil-soup":      "🍅",
  "sparkling-water":        "💧",
  "still-water":            "💧",
  "chocolate-lava-cake":    "🍫",
};

/* ─── Tag badge mapping ─── */
export function getTagStyle(tag: string): { bg: string; text: string } {
  switch (tag.toLowerCase()) {
    case "spicy":       return { bg: COLORS.spicyBg, text: COLORS.spicyText };
    case "popular":     return { bg: COLORS.popularBg, text: COLORS.popularText };
    case "vegetarian":  return { bg: COLORS.vegBg, text: COLORS.vegText };
    case "drink":
    case "non-alcoholic": return { bg: COLORS.drinkBg, text: COLORS.drinkText };
    default:            return { bg: COLORS.warm, text: COLORS.brown };
  }
}

/* ─── Shadows ─── */
export const shadow = {
  shadowColor: "#1F1408",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
};

export const shadowMedium = {
  shadowColor: "#1F1408",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 5,
};

export const shadowLarge = {
  shadowColor: "#1F1408",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 8,
};

/* ─── Card preset ─── */
export const card = StyleSheet.create({
  base: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...shadow,
  },
});

/* ─── Typography scale ─── */
export const TYPE = {
  displayLg:   { fontSize: 32, fontWeight: "800" as const, letterSpacing: -0.8, lineHeight: 38 },
  displayMd:   { fontSize: 26, fontWeight: "700" as const, letterSpacing: -0.5, lineHeight: 32 },
  headlineLg:  { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.4, lineHeight: 28 },
  headlineMd:  { fontSize: 18, fontWeight: "600" as const, letterSpacing: -0.2, lineHeight: 24 },
  bodyLg:      { fontSize: 16, fontWeight: "400" as const, letterSpacing: 0,    lineHeight: 24 },
  bodyMd:      { fontSize: 14, fontWeight: "400" as const, letterSpacing: 0,    lineHeight: 20 },
  bodySm:      { fontSize: 13, fontWeight: "400" as const, letterSpacing: 0.1,  lineHeight: 18 },
  labelLg:     { fontSize: 14, fontWeight: "600" as const, letterSpacing: 0.2,  lineHeight: 18 },
  labelMd:     { fontSize: 12, fontWeight: "600" as const, letterSpacing: 0.8,  lineHeight: 16 },
  labelSm:     { fontSize: 11, fontWeight: "500" as const, letterSpacing: 0.5,  lineHeight: 14 },
  caption:     { fontSize: 10, fontWeight: "500" as const, letterSpacing: 0.3,  lineHeight: 14 },
  priceLg:     { fontSize: 20, fontWeight: "800" as const, letterSpacing: -0.3, lineHeight: 24 },
  priceMd:     { fontSize: 16, fontWeight: "700" as const, letterSpacing: -0.2, lineHeight: 20 },
};

/* ─── Spacing rhythm ─── */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

/* ─── Border radius ─── */
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  full: 999,
};
