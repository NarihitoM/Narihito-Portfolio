"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { Contrast, Droplet, Eye, Minus, Plus, RotateCcw, SunDim, type LucideIcon } from "lucide-react";
import { DialogCloseButton } from "@/shared/components/ui/DialogCloseButton";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { useLenisLock } from "@/shared/hooks/useLenisLock";
import { useAccessibility } from "../hooks/useAccessibility";
import { TEXT_SIZES } from "../lib/preferences";
import type { FontStyle, Vision } from "../types/types";

const FONT_OPTIONS: { value: FontStyle; label: string; hint: string; family: string }[] = [
  { value: "default", label: "Default", hint: "Site fonts", family: "var(--a11y-font-default)" },
  { value: "hyperlegible", label: "Hyperlegible", hint: "Clear letter shapes", family: "var(--font-atkinson)" },
  { value: "lexend", label: "Lexend", hint: "Wider, easy reading", family: "var(--font-lexend)" },
  { value: "system", label: "System", hint: "Your device font", family: "var(--a11y-font-system)" },
];

const VISION_OPTIONS: { value: Vision; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "default", label: "Default", hint: "Original colors", icon: Eye },
  { value: "contrast", label: "High contrast", hint: "Brighter text and borders", icon: Contrast },
  { value: "grayscale", label: "Grayscale", hint: "Remove all color", icon: Droplet },
  { value: "dim", label: "Dim", hint: "Softer brightness", icon: SunDim },
];

const FOCUSABLE = "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

function optionClass(selected: boolean) {
  return `relative flex flex-col items-start gap-1 rounded-[6px] border px-3.5 py-3 text-left transition-colors ${
    selected
      ? "border-violet bg-chip text-text-primary"
      : "border-border-glow-soft text-text-secondary hover:border-border-glow hover:text-text-primary"
  }`;
}

function SelectedDot({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-violet transition-opacity ${selected ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h3 id={id} className="font-mono fs-12 tracking-[2.5px] text-text-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-glow-soft text-text-primary transition-[border-color,transform] hover:border-violet active:scale-90 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}

export function AccessibilitySheet({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const { prefs, update, reset, isDefault } = useAccessibility();
  const sizeIndex = TEXT_SIZES.indexOf(prefs.size);
  useLenisLock(true);

  useGSAP(
    () => {
      registerGsap();
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      if (!overlay || !panel) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(overlay, { opacity: 1 });
        gsap.set(panel, { xPercent: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.fromTo(panel, { xPercent: -100 }, { xPercent: 0, duration: 0.45, ease: ease.entrance });
      });

      return () => mm.revert();
    },
    { scope: panelRef },
  );

  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, []);

  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      onClose();
      return;
    }

    gsap.to(panel, { xPercent: -100, duration: 0.35, ease: "power2.in" });
    gsap.to(overlay, { opacity: 0, duration: 0.35, delay: 0.05, ease: "power2.in", onComplete: onClose });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      handleClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;

    const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[70]" onClick={handleClose} onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-title"
        data-lenis-prevent
        onClick={(event) => event.stopPropagation()}
        className="relative flex h-full w-full max-w-[380px] flex-col border-r border-border-glow bg-bg-alt"
      >
        <DialogCloseButton onClick={handleClose} />

        <div className="flex flex-1 flex-col gap-9 overflow-y-auto overscroll-contain px-6 pt-8 pb-6 md:px-8 md:pt-10">
          <div className="flex flex-col gap-2 pr-10">
            <span className="font-mono fs-12 tracking-[3px] text-violet">ACCESSIBILITY</span>
            <h2
              id="a11y-title"
              tabIndex={-1}
              data-autofocus
              className="font-display fs-26 font-semibold leading-[1.1] tracking-[-0.8px] text-text-primary outline-none"
            >
              Reading preferences
            </h2>
            <p className="font-body fs-14 leading-[1.6] text-text-secondary">
              Changes apply right away and stay saved on this device.
            </p>
          </div>

          <Section id="a11y-font" title="FONT STYLE">
            <div className="grid grid-cols-2 gap-2.5">
              {FONT_OPTIONS.map((option) => {
                const selected = prefs.font === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ font: option.value })}
                    className={optionClass(selected)}
                  >
                    <SelectedDot selected={selected} />
                    <span aria-hidden className="fs-24 leading-none text-text-primary" style={{ fontFamily: option.family }}>
                      Aa
                    </span>
                    <span className="pt-1.5 font-body fs-13 font-medium text-text-primary">{option.label}</span>
                    <span className="font-body fs-12 leading-[1.4] text-text-muted">{option.hint}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section id="a11y-size" title="TEXT SIZE">
            <div className="flex items-center gap-3 rounded-[6px] border border-border-glow-soft p-3">
              <StepButton
                label="Decrease text size"
                disabled={sizeIndex <= 0}
                onClick={() => update({ size: TEXT_SIZES[sizeIndex - 1] })}
              >
                <Minus size={16} />
              </StepButton>
              <div className="flex flex-1 flex-col items-center gap-2">
                <span aria-live="polite" className="font-display fs-22 font-semibold text-text-primary">
                  {prefs.size}%
                </span>
                <div aria-hidden className="flex items-center gap-1.5">
                  {TEXT_SIZES.map((size, index) => (
                    <span
                      key={size}
                      className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                        index === sizeIndex ? "w-[18px] bg-violet" : "w-1.5 bg-text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <StepButton
                label="Increase text size"
                disabled={sizeIndex >= TEXT_SIZES.length - 1}
                onClick={() => update({ size: TEXT_SIZES[sizeIndex + 1] })}
              >
                <Plus size={16} />
              </StepButton>
            </div>
          </Section>

          <Section id="a11y-vision" title="VISION">
            <div className="grid grid-cols-2 gap-2.5">
              {VISION_OPTIONS.map((option) => {
                const selected = prefs.vision === option.value;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ vision: option.value })}
                    className={optionClass(selected)}
                  >
                    <SelectedDot selected={selected} />
                    <Icon size={20} strokeWidth={1.6} className="text-text-primary" />
                    <span className="pt-1.5 font-body fs-13 font-medium text-text-primary">{option.label}</span>
                    <span className="font-body fs-12 leading-[1.4] text-text-muted">{option.hint}</span>
                  </button>
                );
              })}
            </div>
          </Section>
        </div>

        <div className="border-t border-border-glow-soft px-6 py-5 md:px-8">
          <button
            type="button"
            onClick={reset}
            disabled={isDefault}
            className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-border-glow-soft py-3 font-mono fs-12 tracking-[2px] text-text-secondary transition-colors hover:border-violet hover:text-violet disabled:pointer-events-none disabled:opacity-40"
          >
            <RotateCcw size={14} />
            RESET TO DEFAULT
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
