export function formatINR(value: number | null | undefined, symbol = "₹"): string {
  if (value === null || value === undefined) return "Price on request";
  return `${symbol}${value.toLocaleString("en-IN")}`;
}

export function waLink(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
