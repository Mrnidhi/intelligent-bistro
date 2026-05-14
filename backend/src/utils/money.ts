const TAX_RATE = 0.09;

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calcCartSummary(subtotal: number) {
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + tax);
  return { subtotal: round2(subtotal), tax, total };
}
