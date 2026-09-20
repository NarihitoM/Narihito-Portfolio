"use client";

import Image from "next/image";
import type { RefObject } from "react";
import { ease, gsap } from "@/shared/lib/gsap";

export function WipeVeil({
  veilRef,
  panelRef,
  className = "z-61 lg:hidden",
  brand = false,
  diagonal = true,
  bgFollow = false,
}: {
  veilRef: RefObject<HTMLDivElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  className?: string;
  brand?: boolean;
  diagonal?: boolean;
  bgFollow?: boolean;
}) {
  const bgFollowLayer = bgFollow ? (
    <div data-veil-bg className="absolute inset-0 bg-bg opacity-0" />
  ) : null;
  const brandBlock = brand ? (
    <div
      data-veil-brand
      className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 ${diagonal ? "-rotate-45" : ""} flex-col items-center gap-5`}
    >
      <div className="h-14 w-14 overflow-hidden rounded-full md:h-16 md:w-16">
        <Image src="/img/Narihito.jpg" alt="" width={64} height={64} className="h-full w-full object-cover" />
      </div>
      <span className="font-display text-[28px] font-bold uppercase tracking-[6px] text-veil-fg">NARIHITO</span>
      <span
        data-veil-label
        className="font-mono text-[13px] font-medium uppercase tracking-[4px] text-veil-fg/70"
      />
    </div>
  ) : null;

  return (
    <div
      ref={veilRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 hidden overflow-hidden ${className}`}
    >
      {diagonal ? (
        <div className="absolute left-1/2 top-1/2 h-[240vmax] w-[240vmax] -translate-x-1/2 -translate-y-1/2 rotate-45">
          <div ref={panelRef} className="relative h-full w-full overflow-hidden bg-veil">
            {bgFollowLayer}
            {brandBlock}
          </div>
        </div>
      ) : (
        <div ref={panelRef} className="relative h-full w-full overflow-hidden bg-veil">
          {bgFollowLayer}
          {brandBlock}
        </div>
      )}
    </div>
  );
}

export function playDrawerVeil({
  drawer,
  veil,
  panel,
  items,
  open,
  instant = false,
}: {
  drawer: HTMLElement;
  veil: HTMLElement;
  panel: HTMLElement;
  items: NodeListOf<Element>;
  open: boolean;
  instant?: boolean;
}) {
  gsap.killTweensOf([drawer, panel, items]);
  const timeline = gsap.timeline();

  if (!open && instant) {
    timeline.set(drawer, { display: "none" }).set(veil, { display: "none" });
    return timeline;
  }

  if (open) {
    timeline
      .set(veil, { display: "block" })
      .set(panel, { xPercent: 100 })
      .to(panel, { xPercent: 0, duration: 0.22, ease: ease.wipe })
      .set(drawer, { display: "flex", xPercent: 0 })
      .set(items, { opacity: 0, xPercent: 8, y: 28 })
      .to(panel, { xPercent: -100, duration: 0.24, ease: ease.wipe }, "reveal")
      .to(
        items,
        { opacity: 1, xPercent: 0, y: 0, duration: 0.4, stagger: 0.045, ease: ease.entrance },
        "reveal",
      )
      .set(veil, { display: "none" }, "reveal+=0.24");
  } else {
    timeline
      .set(veil, { display: "block" })
      .set(panel, { xPercent: -100 })
      .to(panel, { xPercent: 0, duration: 0.2, ease: ease.wipe })
      .set(drawer, { display: "none" })
      .to(panel, { xPercent: 100, duration: 0.22, ease: ease.wipe })
      .set(veil, { display: "none" });
  }

  return timeline;
}
