const YEAR_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export function yearsOfExperience(years: number): string {
  const safeYears = Math.max(1, years);
  const word = YEAR_WORDS[safeYears] ?? String(safeYears);
  return `${word} year${safeYears === 1 ? "" : "s"}`;
}
