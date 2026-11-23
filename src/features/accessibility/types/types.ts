export type FontStyle = "default" | "hyperlegible" | "lexend" | "system";

export type Vision = "default" | "contrast" | "grayscale" | "dim";

export interface AccessibilityPrefs {
  font: FontStyle;
  size: number;
  vision: Vision;
}
