export function parseCountable(value: string) {
  const match = value.match(/^([+-]?)(\d+(?:\.(\d+))?)(.*)$/);
  if (!match) return null;
  const [, prefix, num, decimalDigits, suffix] = match;
  if (suffix.includes("→")) return null;
  return {
    prefix,
    target: parseFloat(num),
    decimals: decimalDigits?.length ?? 0,
    suffix,
  };
}
