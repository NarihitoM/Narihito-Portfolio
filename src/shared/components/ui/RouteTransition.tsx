"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { WipeVeil } from "@/shared/components/ui/WipeVeil";

const PANEL_DURATION = 0.6;
const LETTER_STAGGER = 0.045;
const COVER_TIMEOUT = 3600;
const MIN_COVER_MS = 1200;

function labelForPath(path: string) {
  const segment = path.split(/[?#]/)[0].split("/").filter(Boolean).pop();
  if (!segment) return "[ PORTFOLIO ]";
  return `[ ${segment.replace(/-/g, " ").toUpperCase()} ]`;
}

export function RouteTransition() {
  const veilRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  const covered = useRef(false);
  const coveredAt = useRef(0);
  const failsafe = useRef(0);
  const pending = useRef<string | null>(null);
  const revealRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const veil = veilRef.current;
    const panel = panelRef.current;
    if (!veil || !panel) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    registerGsap();

    const brand = panel.querySelector("[data-veil-brand]");
    const label = panel.querySelector("[data-veil-label]");
    const letters = panel.querySelectorAll("[data-veil-letter]");
    const leftLeaf = panel.querySelector('[data-veil-leaf="left"]');
    const rightLeaf = panel.querySelector('[data-veil-leaf="right"]');

    const reveal = () => {
      if (!covered.current) return;
      covered.current = false;
      window.clearTimeout(failsafe.current);

      const held = performance.now() - coveredAt.current;
      const wait = Math.max(0, MIN_COVER_MS - held) / 1000;

      gsap
        .timeline({ delay: wait })
        .to(brand, { opacity: 0, scale: 0.94, duration: 0.2, ease: ease.interaction })
        .to(leftLeaf, { xPercent: -100, duration: PANEL_DURATION, ease: ease.wipe })
        .to(rightLeaf, { xPercent: 100, duration: PANEL_DURATION, ease: ease.wipe }, "<")
        .set(veil, { display: "none" });
    };

    revealRef.current = reveal;

    const go = () => {
      const href = pending.current;
      if (!href) return;
      pending.current = null;
      coveredAt.current = performance.now();
      router.push(href);
    };

    const cover = (href: string) => {
      covered.current = true;
      pending.current = href;
      if (label) label.textContent = labelForPath(href);
      gsap.killTweensOf([leftLeaf, rightLeaf, brand, letters]);
      gsap
        .timeline({ onComplete: go })
        .set(veil, { display: "block" })
        .set(leftLeaf, { xPercent: -100 })
        .set(rightLeaf, { xPercent: 100 })
        .set(brand, { opacity: 0, scale: 0.94 })
        .set(letters, { opacity: 0, y: 10 })
        .to(leftLeaf, { xPercent: 0, duration: PANEL_DURATION, ease: ease.wipe })
        .to(rightLeaf, { xPercent: 0, duration: PANEL_DURATION, ease: ease.wipe }, "<")
        .to(brand, { opacity: 1, scale: 1, duration: 0.2, ease: ease.entrance })
        .to(letters, { opacity: 1, y: 0, duration: 0.3, stagger: LETTER_STAGGER, ease: ease.entrance });
      window.clearTimeout(failsafe.current);
      failsafe.current = window.setTimeout(() => {
        go();
        reveal();
      }, COVER_TIMEOUT);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;

      const path = href.split(/[?#]/)[0];
      if (path === window.location.pathname) return;
      if (/\.[a-z0-9]+$/i.test(path)) return;
      if (covered.current) return;

      event.preventDefault();
      cover(href);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(failsafe.current);
      revealRef.current = null;
    };
  }, [router]);

  useEffect(() => {
    const veil = veilRef.current;
    const panel = panelRef.current;
    if (!veil || !panel) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    if (covered.current) {
      revealRef.current?.();
      return;
    }

    const brand = panel.querySelector("[data-veil-brand]");
    const label = panel.querySelector("[data-veil-label]");
    const letters = panel.querySelectorAll("[data-veil-letter]");
    const leftLeaf = panel.querySelector('[data-veil-leaf="left"]');
    const rightLeaf = panel.querySelector('[data-veil-leaf="right"]');
    if (label) label.textContent = labelForPath(pathname);

    gsap.killTweensOf([leftLeaf, rightLeaf, brand, letters]);
    gsap
      .timeline()
      .set(veil, { display: "block" })
      .set(leftLeaf, { xPercent: 0 })
      .set(rightLeaf, { xPercent: 0 })
      .set(brand, { opacity: 1, scale: 1 })
      .set(letters, { opacity: 1, y: 0 })
      .to(brand, { opacity: 0, scale: 0.94, duration: 0.2, ease: ease.interaction, delay: 0.4 })
      .to(leftLeaf, { xPercent: -100, duration: PANEL_DURATION, ease: ease.wipe })
      .to(rightLeaf, { xPercent: 100, duration: PANEL_DURATION, ease: ease.wipe }, "<")
      .set(veil, { display: "none" });
  }, [pathname]);

  return (
    <WipeVeil
      veilRef={veilRef}
      panelRef={panelRef}
      className="z-99"
      brand
      door
      panelBg="bg-bg"
      brandFgVar="--color-text-primary"
    />
  );
}
