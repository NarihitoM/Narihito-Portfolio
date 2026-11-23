"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { PersonStanding } from "lucide-react";
import { gsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { clampPoint, dockMetrics, saveDock, useFloatingDock, type Point } from "../hooks/useFloatingDock";
import { AccessibilitySheet } from "./AccessibilitySheet";

const HOLD_MS = 250;
const MOUSE_THRESHOLD = 6;
const TOUCH_THRESHOLD = 10;
const TUCK_RATIO = 0.3;
const MAX_STRETCH = 0.35;

interface DragState {
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  active: boolean;
  timer: number;
}

function reducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState<Point | null>(null);
  const docked = useFloatingDock();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const moverRef = useRef<HTMLSpanElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const releaseRef = useRef<Point | null>(null);
  const relaxRef = useRef(0);
  const suppressClickRef = useRef(false);
  const point = drag ?? docked;
  const tucked = !drag && docked !== null;

  useLayoutEffect(() => {
    const from = releaseRef.current;
    const mover = moverRef.current;
    const blob = blobRef.current;
    if (drag || !from || !docked || !mover || !blob) return;
    releaseRef.current = null;
    if (reducedMotion()) return;

    gsap.fromTo(
      mover,
      { x: from.x - docked.x, y: from.y - docked.y },
      { x: 0, y: 0, duration: 0.95, ease: "elastic.out(1, 0.5)" },
    );
    gsap
      .timeline()
      .to(blob, { rotation: 0, scaleX: 1.3, scaleY: 0.78, duration: 0.18, ease: "power2.out" })
      .to(blob, { scaleX: 0.78, scaleY: 1.22, duration: 0.14, ease: "power2.in" })
      .to(blob, { scaleX: 1, scaleY: 1, duration: 1, ease: "elastic.out(1.2, 0.3)" });
  }, [docked, drag]);

  const buttonStyle = (): CSSProperties | undefined => {
    if (!point) return undefined;
    if (!tucked || !docked) return { left: point.x, top: point.y };
    const { margin, size } = dockMetrics();
    const offset = margin + size * TUCK_RATIO;
    return { left: point.x, top: point.y, "--tuck": `${docked.side === "left" ? -offset : offset}px` } as CSSProperties;
  };

  const pointFrom = (state: DragState) => clampPoint({ x: state.lastX - state.offsetX, y: state.lastY - state.offsetY });

  const stretch = (dx: number, dy: number, dt: number) => {
    const blob = blobRef.current;
    if (!blob || reducedMotion()) return;
    const speed = Math.hypot(dx, dy) / Math.max(dt, 1);
    const amount = Math.min(speed * 0.12, MAX_STRETCH);
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle > 90) angle -= 180;
    if (angle < -90) angle += 180;

    gsap.set(blob, { rotation: angle });
    gsap.to(blob, { scaleX: 1 + amount, scaleY: 1 - amount * 0.55, duration: 0.15, ease: "power2.out", overwrite: "auto" });
    window.clearTimeout(relaxRef.current);
    relaxRef.current = window.setTimeout(() => {
      gsap.to(blob, { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
    }, 90);
  };

  const activate = (state: DragState) => {
    window.clearTimeout(state.timer);
    state.active = true;
    const mover = moverRef.current;
    if (mover) {
      gsap.killTweensOf(mover);
      gsap.set(mover, { x: 0, y: 0 });
    }
    setDrag(pointFrom(state));
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    suppressClickRef.current = false;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);

    const state: DragState = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      active: false,
      timer: 0,
    };
    state.timer = window.setTimeout(() => activate(state), HOLD_MS);
    dragRef.current = state;
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const state = dragRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    const dt = event.timeStamp - state.lastTime;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastTime = event.timeStamp;

    if (state.active) {
      setDrag(pointFrom(state));
      stretch(dx, dy, dt);
      return;
    }

    const threshold = state.pointerType === "mouse" ? MOUSE_THRESHOLD : TOUCH_THRESHOLD;
    if (Math.hypot(event.clientX - state.startX, event.clientY - state.startY) > threshold) activate(state);
  };

  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const state = dragRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    window.clearTimeout(state.timer);
    window.clearTimeout(relaxRef.current);
    dragRef.current = null;
    if (!state.active) return;

    const dropped = pointFrom(state);
    suppressClickRef.current = true;
    releaseRef.current = dropped;
    saveDock(dropped);
    setDrag(null);
  };

  const onClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const positionClass = point ? "" : "invisible";
  const motionClass = drag
    ? "scale-110 cursor-grabbing transition-[scale] duration-200"
    : "transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95";
  const edgeZoneClass = docked?.side === "right" ? "after:left-full" : "after:right-full";
  const tooltipClass =
    (docked?.side ?? "left") === "left" ? "left-full ml-3 -translate-x-1" : "right-full mr-3 translate-x-1";
  const tuckClass = tucked
    ? `translate-x-[var(--tuck)] opacity-80 hover:translate-x-0 hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100 after:absolute after:inset-y-0 after:w-5 md:after:w-8 after:content-[''] ${edgeZoneClass}`
    : "";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open accessibility menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onContextMenu={(event) => event.preventDefault()}
        style={buttonStyle()}
        className={`a11y-unzoom group fixed z-40 flex h-11 w-11 md:h-12 md:w-12 touch-none select-none items-center justify-center text-wire [-webkit-touch-callout:none] ${positionClass} ${motionClass} ${tuckClass}`}
      >
        <span ref={moverRef} className="absolute inset-0 flex items-center justify-center">
          <span
            ref={blobRef}
            aria-hidden
            className={`absolute inset-0 rounded-full bg-violet transition-shadow duration-300 ${
              drag
                ? "shadow-[0_14px_32px_-10px_var(--color-violet)]"
                : "shadow-[0_10px_28px_-12px_var(--color-violet)]"
            }`}
          />
          <PersonStanding size={22} strokeWidth={1.8} className="relative" />
        </span>
        {!drag && (
          <span
            aria-hidden
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-violet px-2.5 py-1.5 font-mono text-[11px] tracking-[1.5px] text-wire opacity-0 transition-[opacity,translate] duration-200 [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${tooltipClass}`}
          >
            ACCESSIBILITY
          </span>
        )}
      </button>
      {open && <AccessibilitySheet onClose={close} />}
    </>
  );
}
