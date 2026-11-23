import type { AccessibilityPrefs, FontStyle, Vision } from "../types/types";

export const ACCESSIBILITY_STORAGE_KEY = "narihito-a11y";

export const FONT_STYLES: readonly FontStyle[] = ["default", "hyperlegible", "lexend", "system"];
export const VISIONS: readonly Vision[] = ["default", "contrast", "grayscale", "dim"];
export const TEXT_SIZES: readonly number[] = [90, 100, 110, 120, 130];

export const DEFAULT_PREFS: AccessibilityPrefs = { font: "default", size: 100, vision: "default" };

export function isFontStyle(value: unknown): value is FontStyle {
  return FONT_STYLES.includes(value as FontStyle);
}

export function isVision(value: unknown): value is Vision {
  return VISIONS.includes(value as Vision);
}

export function isTextSize(value: unknown): value is number {
  return typeof value === "number" && TEXT_SIZES.includes(value);
}

export const accessibilityInitScript = `
try {
  var prefs = JSON.parse(window.localStorage.getItem('${ACCESSIBILITY_STORAGE_KEY}') || '{}');
  var root = document.documentElement;
  if (${JSON.stringify(FONT_STYLES.slice(1))}.indexOf(prefs.font) > -1) root.setAttribute('data-a11y-font', prefs.font);
  if (${JSON.stringify(TEXT_SIZES.filter((size) => size !== 100))}.indexOf(prefs.size) > -1) root.setAttribute('data-a11y-size', String(prefs.size));
  if (${JSON.stringify(VISIONS.slice(1))}.indexOf(prefs.vision) > -1) root.setAttribute('data-a11y-vision', prefs.vision);
} catch (e) {}
`;
