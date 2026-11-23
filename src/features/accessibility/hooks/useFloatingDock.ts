"use client";

import { useSyncExternalStore } from "react";

const DOCK_STORAGE_KEY = "narihito-a11y-dock";

export type Side = "left" | "right";

interface Dock {
  side: Side;
  yRatio: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface DockPoint extends Point {
  side: Side;
}

const listeners = new Set<() => void>();
let cachedKey = "";
let cachedPoint: DockPoint | null = null;

function viewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

export function dockMetrics() {
  const wide = window.innerWidth >= 768;
  return { margin: wide ? 32 : 20, size: wide ? 48 : 44 };
}

export function clampPoint(point: Point): Point {
  const { margin, size } = dockMetrics();
  return {
    x: Math.min(Math.max(point.x, margin), viewportWidth() - size - margin),
    y: Math.min(Math.max(point.y, margin), window.innerHeight - size - margin),
  };
}

function parseDock(raw: string | null): Dock | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const { side, yRatio } = value as Partial<Dock>;
    if ((side !== "left" && side !== "right") || typeof yRatio !== "number") return null;
    return { side, yRatio };
  } catch {
    return null;
  }
}

function toPoint(dock: Dock | null): DockPoint {
  const { margin, size } = dockMetrics();
  const side = dock?.side ?? "left";
  const x = side === "left" ? margin : viewportWidth() - size - margin;
  const y = dock ? dock.yRatio * window.innerHeight : (window.innerHeight - size) / 2;
  return { ...clampPoint({ x, y }), side };
}

function getSnapshot() {
  const raw = window.localStorage.getItem(DOCK_STORAGE_KEY);
  const key = `${raw}|${viewportWidth()}|${window.innerHeight}`;
  if (key !== cachedKey) {
    cachedKey = key;
    cachedPoint = toPoint(parseDock(raw));
  }
  return cachedPoint;
}

function getServerSnapshot() {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const observer = new ResizeObserver(listener);
  observer.observe(document.documentElement);
  window.addEventListener("resize", listener);
  return () => {
    listeners.delete(listener);
    observer.disconnect();
    window.removeEventListener("resize", listener);
  };
}

export function saveDock(point: Point) {
  const { size } = dockMetrics();
  const side: Side = point.x + size / 2 < viewportWidth() / 2 ? "left" : "right";
  const dock: Dock = { side, yRatio: point.y / window.innerHeight };
  window.localStorage.setItem(DOCK_STORAGE_KEY, JSON.stringify(dock));
  listeners.forEach((listener) => listener());
}

export function useFloatingDock() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
