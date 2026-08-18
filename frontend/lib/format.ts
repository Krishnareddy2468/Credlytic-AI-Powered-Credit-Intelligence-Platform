const inrFormatter = new Intl.NumberFormat("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" });

/** ₹14,400 — Indian digit grouping, no decimals. */
export function formatINR(value: number) {
  return inrFormatter.format(value);
}

/** ₹1.2L / ₹85,000 — compact form for dense financial surfaces. */
export function formatCompactINR(value: number) {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  return inrFormatter.format(value);
}
