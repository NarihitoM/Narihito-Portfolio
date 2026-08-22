const CAREER_START_YEAR = 2025;
const YEAR_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export function yearsOfExperience(): string {
  const years = Math.max(1, new Date().getFullYear() - CAREER_START_YEAR);
  const word = YEAR_WORDS[years] ?? String(years);
  return `${word} year${years === 1 ? "" : "s"}`;
}
