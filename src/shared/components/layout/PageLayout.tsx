"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Home } from "lucide-react";
import { ease, gsap, registerGsap, ScrollTrigger, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { ModeToggle } from "@/features/portfolio/components/ModeToggle";
import { ScrollToTop } from "@/features/portfolio/components/ScrollToTop";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import type { PageLayoutProps } from "@/shared/types/types";

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Events", "Testimonials", "Contact"];
const ROUTED_LINKS = ["About", "Skills", "Experience", "Projects", "Events", "Testimonials"];

export function PageLayout({
  children,
  backLink,
  backHref,
  breadcrumb,
  eyebrow,
  title,
  deck,
  meta,
  metaLoading = false,
  metaError = false,
  prev,
  next,
}: PageLayoutProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useGSAP(
    () => {
      registerGsap();
      const headerEl = pageRef.current?.querySelector("header") as HTMLElement | null;
      if (!headerEl) return;

      ScrollTrigger.create({
        trigger: document.body,
        start: "top -80",
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 80) {
            gsap.to(headerEl, {
              backdropFilter: "blur(12px)",
              boxShadow: "0 1px 0 var(--color-border-glow-soft)",
              duration: 0.3,
              ease: ease.interaction,
            });
          } else if (self.scroll() <= 80) {
            gsap.to(headerEl, {
              backdropFilter: "blur(0px)",
              boxShadow: "none",
              duration: 0.3,
              ease: ease.interaction,
            });
          }
        },
      });
    },
    { scope: pageRef },
  );

  useGSAP(
    () => {
      registerGsap();

      const mm = gsap.matchMedia();

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.from("[data-page-title]", {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: ease.splitReveal,
          delay: 0.2,
        });

        gsap.from("[data-page-deck]", {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: ease.entrance,
          delay: 0.4,
        });

        gsap.from("[data-meta-item]", {
          opacity: 0,
          y: 12,
          duration: 0.5,
          ease: ease.entrance,
          stagger: 0.06,
          delay: 0.5,
        });
      });

      return () => mm.revert();
    },
    { scope: pageRef },
  );

  useGSAP(
    () => {
      const drawer = drawerRef.current;
      if (!drawer) return;

      const items = drawer.querySelectorAll("[data-drawer-item]");
      gsap.killTweensOf(drawer);
      gsap.killTweensOf(items);

      if (menuOpen) {
        gsap.set(drawer, { display: "flex" });
        gsap.fromTo(
          drawer,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.5, ease: ease.wipe, overwrite: true },
        );
        gsap.fromTo(
          items,
          { opacity: 0, xPercent: 8, y: 28 },
          {
            opacity: 1,
            xPercent: 0,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            delay: 0.2,
            ease: ease.entrance,
            overwrite: true,
          },
        );
      } else {
        gsap.to(drawer, {
          xPercent: 100,
          duration: 0.4,
          ease: ease.wipe,
          overwrite: true,
          onComplete: () => gsap.set(drawer, { display: "none" }),
        });
      }
    },
    { dependencies: [menuOpen] },
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-bg">
      <header className="fixed top-0 z-50 w-full bg-bg-panel h-[60px] md:h-[72px] flex items-center justify-between px-5 md:px-12">
        <Link href="/" className="block h-8 w-8 md:h-9 md:w-9 overflow-hidden rounded-full">
          <Image
            src="/img/Narihito.jpg"
            alt="Narihito"
            width={36}
            height={36}
            className="h-full w-full object-cover"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const href = `/${ROUTED_LINKS.includes(link) ? link.toLowerCase() : `#${link.toLowerCase()}`}`;
              const isActive = pathname === `/${link.toLowerCase()}`;
              return (
                <li key={link}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative font-body text-[14px] font-medium transition-colors ${
                      isActive ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {link}
                    {isActive ? (
                      <span className="absolute -bottom-1 left-0 h-px w-full bg-text-primary" />
                    ) : (
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-text-primary transition-all duration-300 ease-out group-hover:w-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ModeToggle />
          <Link
            href="/resume/Narihito CV.pdf"
            className="flex items-center justify-center rounded-[4px] bg-violet px-5 py-2.5 font-body text-[13px] font-semibold text-wire"
          >
            Download CV
          </Link>
        </nav>

        <div className="flex lg:hidden items-center gap-2">
          <ModeToggle />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-chip text-text-primary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      <div
        ref={drawerRef}
        data-lenis-prevent
        className="no-scrollbar fixed inset-0 z-[60] hidden flex-col overflow-y-auto bg-bg-panel-solid px-5 pt-18 pb-8 lg:hidden"
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="absolute top-[8px] right-5 flex h-11 w-11 items-center justify-center rounded-full bg-chip text-text-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="m-auto flex w-full flex-col items-end gap-5 pr-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === `/${link.toLowerCase()}`;
            return (
              <Link
                key={link}
                data-drawer-item
                href={`/${ROUTED_LINKS.includes(link) ? link.toLowerCase() : `#${link.toLowerCase()}`}`}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`wave-link${isActive ? " is-active" : ""} shrink-0 font-display text-[clamp(32px,9vw,52px)] font-bold uppercase leading-[1.08] tracking-[-0.02em]`}
              >
                {link.split("").map((char, i) => (
                  <span key={i} className="wave-char" style={{ transitionDelay: `${i * 35}ms` }}>
                    {char}
                  </span>
                ))}
              </Link>
            );
          })}

          <div data-drawer-item className="shrink-0 pt-4">
            <Link
              href="/resume/Narihito CV.pdf"
              className="flex items-center justify-center rounded-[4px] bg-violet px-7 py-4 font-body text-[15px] font-semibold text-wire"
            >
              Download CV
            </Link>
          </div>
        </div>
      </div>

      <div className="h-[84px] md:h-[100px]" />

      <div className="sticky top-[60px] md:top-[72px] z-40 flex items-center justify-between gap-3 bg-bg px-5 md:px-10 lg:px-[120px] py-4 md:py-[18px]">
        <Link
          href={backHref}
          className="group font-mono text-[12px] text-text-secondary transition-[color,transform] duration-150 ease-out hover:text-text-primary active:scale-95 active:text-violet"
        >
          <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-x-1 group-active:-translate-x-1.5">←</span> {backLink}
        </Link>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
          <Link href="/" aria-label="Home" className="text-text-secondary transition-colors hover:text-text-primary">
            <Home size={12} />
          </Link>
          {breadcrumb.replace(/^HOME\s*\/\s*/i, "/ ")}
        </span>
      </div>

      <div className="flex flex-col gap-6 md:gap-7 px-5 md:px-10 lg:px-[120px] pt-6 md:pt-12">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[3px] text-violet">
          {eyebrow}
        </p>
        <h1
          data-page-title
          className="font-display text-[32px] md:text-[52px] lg:text-[76px] font-semibold leading-[1.05] md:leading-[1.02] lg:leading-[0.98] tracking-[-1px] md:tracking-[-2px] lg:tracking-[-3px] text-text-primary max-w-[1080px]"
        >
          {title}
        </h1>
        <p
          data-page-deck
          className="font-body text-[16px] md:text-[18px] lg:text-[19px] leading-[1.55] text-text-secondary max-w-[760px]"
        >
          {deck}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-8 md:gap-x-12 gap-y-4 px-5 md:px-10 lg:px-[120px] pt-8 md:pt-12">
        {meta.map((item) => (
          <div key={item.key} data-meta-item className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-text-muted">{item.key}</span>
            {metaLoading ? (
              <Skeleton className="h-3 w-20" />
            ) : metaError ? (
              <span className="font-mono text-[12px] text-text-secondary">-</span>
            ) : (
              <span className="font-mono text-[12px] text-text-secondary">{item.value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="px-5 md:px-10 lg:px-[120px] pt-8 md:pt-12">
        <div className="h-px w-full bg-border-glow-soft" />
      </div>

      <div className="px-5 md:px-10 lg:px-[120px] pt-8 md:pt-20 pb-16 md:pb-24">
        {children}
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 px-5 md:px-10 lg:px-[120px] pt-12 md:pt-28 pb-12">
        <Link
          href={prev.href}
          className="group flex-1 flex flex-col gap-3 py-6 border-t border-border-glow-soft"
        >
          <span className="font-mono text-[11px] text-text-muted group-hover:text-text-primary transition-colors">
            {prev.direction}
          </span>
          <span className="font-display text-[24px] md:text-[28px] font-semibold text-text-primary">
            {prev.title}
          </span>
        </Link>
        <Link
          href={next.href}
          className="group flex-1 flex flex-col gap-3 py-6 border-t border-border-glow-soft md:text-right"
        >
          <span className="font-mono text-[11px] text-text-muted group-hover:text-text-primary transition-colors">
            NEXT <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
          </span>
          <span className="font-display text-[24px] md:text-[28px] font-semibold text-text-primary">
            {next.title}
          </span>
        </Link>
      </div>

      <footer className="px-5 md:px-10 lg:px-[120px] pb-8 md:pb-14">
        <div className="h-px w-full bg-border-glow-soft" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 pt-5">
          <span className="font-mono text-[11px] md:text-[12px] text-text-muted">
            © 2026 Narihito. All rights reserved.
          </span>
          <span className="font-mono text-[11px] md:text-[12px] text-text-muted">
            Designed &amp; developed by Narihito.
          </span>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
