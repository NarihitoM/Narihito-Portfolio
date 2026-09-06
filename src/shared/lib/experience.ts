const YEAR_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export function yearsOfExperience(years: number): string {
  const safeYears = Number.isFinite(years) ? Math.max(1, Math.floor(years)) : 1;
  const word = YEAR_WORDS[safeYears] ?? String(safeYears);
  return `${word} year${safeYears === 1 ? "" : "s"}`;
}
