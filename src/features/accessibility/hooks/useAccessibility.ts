"use client";

import { useCallback, useSyncExternalStore } from "react";
import { ScrollTrigger } from "@/shared/lib/gsap";
import {
  ACCESSIBILITY_STORAGE_KEY,
  DEFAULT_PREFS,
  isFontStyle,
  isTextSize,
  isVision,
} from "../lib/preferences";
import type { AccessibilityPrefs } from "../types/types";

const listeners = new Set<() => void>();
let current: AccessibilityPrefs | null = null;

function readFromDocument(): AccessibilityPrefs {
  const root = document.documentElement;
  const font = root.getAttribute("data-a11y-font");
  const size = Number(root.getAttribute("data-a11y-size"));
  const vision = root.getAttribute("data-a11y-vision");

  return {
    font: isFontStyle(font) ? font : DEFAULT_PREFS.font,
    size: isTextSize(size) ? size : DEFAULT_PREFS.size,
    vision: isVision(vision) ? vision : DEFAULT_PREFS.vision,
  };
}

function setAttribute(name: string, value: string, fallback: string) {
  const root = document.documentElement;
  if (value === fallback) root.removeAttribute(name);
  else root.setAttribute(name, value);
}

function applyPrefs(next: AccessibilityPrefs) {
  setAttribute("data-a11y-font", next.font, DEFAULT_PREFS.font);
  setAttribute("data-a11y-size", String(next.size), String(DEFAULT_PREFS.size));
  setAttribute("data-a11y-vision", next.vision, DEFAULT_PREFS.vision);
  current = next;
  window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!current) current = readFromDocument();
  return current;
}

function getServerSnapshot() {
  return DEFAULT_PREFS;
}

export function useAccessibility() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback((patch: Partial<AccessibilityPrefs>) => {
    applyPrefs({ ...getSnapshot(), ...patch });
  }, []);

  const reset = useCallback(() => applyPrefs(DEFAULT_PREFS), []);

  const isDefault =
    prefs.font === DEFAULT_PREFS.font && prefs.size === DEFAULT_PREFS.size && prefs.vision === DEFAULT_PREFS.vision;

  return { prefs, update, reset, isDefault };
}
