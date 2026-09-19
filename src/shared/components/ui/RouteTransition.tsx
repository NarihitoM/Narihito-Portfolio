"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { WipeVeil } from "@/shared/components/ui/WipeVeil";

const COVER_TIMEOUT = 1600;

export function RouteTransition() {
  const veilRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  const covered = useRef(false);
  const failsafe = useRef(0);

  useEffect(() => {
    const veil = veilRef.current;
    const panel = panelRef.current;
    if (!veil || !panel) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    registerGsap();

    const brand = panel.querySelector("[data-veil-brand]");

    const reveal = () => {
      if (!covered.current) return;
      covered.current = false;
      window.clearTimeout(failsafe.current);
      gsap.killTweensOf([panel, brand]);
      gsap
        .timeline()
        .to(brand, { opacity: 0, scale: 0.94, duration: 0.22, ease: ease.interaction })
        .to(panel, { xPercent: -100, duration: 0.55, ease: ease.wipe }, "-=0.08")
        .set(veil, { display: "none" });
    };

    const cover = () => {
      covered.current = true;
      gsap.killTweensOf([panel, brand]);
      gsap
        .timeline()
        .set(veil, { display: "block" })
        .set(panel, { xPercent: 100 })
        .set(brand, { opacity: 0, scale: 0.94 })
        .to(panel, { xPercent: 0, duration: 0.45, ease: ease.wipe })
        .to(brand, { opacity: 1, scale: 1, duration: 0.32, ease: ease.entrance }, "-=0.18");
      window.clearTimeout(failsafe.current);
      failsafe.current = window.setTimeout(reveal, COVER_TIMEOUT);
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

      cover();
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(failsafe.current);
    };
  }, []);

  useEffect(() => {
    const veil = veilRef.current;
    const panel = panelRef.current;
    if (!veil || !panel) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const brand = panel.querySelector("[data-veil-brand]");

    covered.current = true;
    window.clearTimeout(failsafe.current);
    gsap.killTweensOf([panel, brand]);
    gsap
      .timeline({ delay: 0.05 })
      .set(veil, { display: "block" })
      .set(panel, { xPercent: 0 })
      .set(brand, { opacity: 1, scale: 1 })
      .to(brand, { opacity: 0, scale: 0.94, duration: 0.22, ease: ease.interaction })
      .to(panel, { xPercent: -100, duration: 0.55, ease: ease.wipe }, "-=0.08")
      .set(veil, { display: "none" })
      .call(() => {
        covered.current = false;
      });
  }, [pathname]);

  return <WipeVeil veilRef={veilRef} panelRef={panelRef} className="z-99" brand />;
}
