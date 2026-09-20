"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap } from "@/shared/lib/gsap";
import { scrollToTarget } from "@/shared/lib/lenis";
import { useLenisLock } from "@/shared/hooks/useLenisLock";
import { WipeVeil, playDrawerVeil } from "@/shared/components/ui/WipeVeil";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/shared/components/ui/Button";

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Events", "Games", "Testimonials", "Contact"];
const HEADER_OFFSET = -72;

export function HeaderNav() {
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const veilPanelRef = useRef<HTMLDivElement>(null);
  const openedOnce = useRef(false);
  const skipVeil = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(NAV_LINKS[0]);
  useLenisLock(menuOpen);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.toLowerCase())).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const link = NAV_LINKS.find((l) => l.toLowerCase() === topMost.target.id);
        if (link) setActiveLink(link);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    registerGsap();
    const header = headerRef.current;
    if (!header) return;

    const trigger = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top -80",
        toggleActions: "play none none reverse",
      },
    });

    trigger.to(header, {
      backdropFilter: "blur(12px)",
      boxShadow: "0 1px 0 var(--color-border-glow-soft)",
      duration: 0.4,
      ease: ease.interaction,
    });
  }, []);

  useGSAP(
    () => {
      const drawer = drawerRef.current;
      const veil = veilRef.current;
      const panel = veilPanelRef.current;
      if (!drawer || !veil || !panel) return;
      if (!menuOpen && !openedOnce.current) return;
      openedOnce.current = true;

      const items = drawer.querySelectorAll("[data-drawer-item]");
      const timeline = playDrawerVeil({
        drawer,
        veil,
        panel,
        items,
        open: menuOpen,
        instant: skipVeil.current,
      });
      skipVeil.current = false;

      return () => {
        timeline.kill();
      };
    },
    { dependencies: [menuOpen] },
  );

  return (
    <>
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full bg-bg-panel h-[60px] md:h-[72px] flex items-center justify-between px-5 md:px-12"
    >
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
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToTarget(`#${link.toLowerCase()}`, HEADER_OFFSET);
                }}
                className={`group relative font-body text-[14px] font-medium transition-colors ${
                  activeLink === link ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {link}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-text-primary transition-all duration-300 ease-out ${
                    activeLink === link ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>
        <ModeToggle />
        <Button href="/resume/Narihito CV.pdf" variant="primary" className="!px-5 !py-2.5 !text-[13px]">
          Download CV
        </Button>
      </nav>

      <div className="flex lg:hidden items-center gap-2">
        <ModeToggle />
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-chip text-text-primary transition-transform active:scale-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
    </header>
    <WipeVeil veilRef={veilRef} panelRef={veilPanelRef} diagonal={false} />
    <MobileDrawer
      drawerRef={drawerRef}
      activeLink={activeLink}
      onClose={(instant) => {
        skipVeil.current = instant === true;
        setMenuOpen(false);
      }}
    />
    </>
  );
}

function MobileDrawer({
  drawerRef,
  activeLink,
  onClose,
}: {
  drawerRef: React.RefObject<HTMLDivElement | null>;
  activeLink: string;
  onClose: (instant?: boolean) => void;
}) {
  return (
    <div
      ref={drawerRef}
      data-lenis-prevent
      className="no-scrollbar fixed inset-x-0 top-0 z-[60] hidden h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-bg-panel-solid px-5 pt-18 pb-8 lg:hidden"
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => onClose()}
        className="absolute top-[8px] right-5 flex h-11 w-11 items-center justify-center rounded-full bg-chip text-text-primary"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="m-auto flex w-full flex-col items-end gap-5 pr-1">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            data-drawer-item
            href={`#${link.toLowerCase()}`}
            onClick={(event) => {
              event.preventDefault();
              onClose();
              requestAnimationFrame(() => scrollToTarget(`#${link.toLowerCase()}`, HEADER_OFFSET));
            }}
            onTouchStart={() => {}}
            className={`wave-link shrink-0 font-display text-[clamp(32px,9vw,52px)] font-bold uppercase leading-[1.08] tracking-[-0.02em] ${
              activeLink === link ? "is-active" : ""
            }`}
          >
            {link.split("").map((char, i) => (
              <span key={i} className="wave-char" style={{ transitionDelay: `${i * 35}ms` }}>
                {char}
              </span>
            ))}
          </a>
        ))}

        <div data-drawer-item className="shrink-0 pt-4">
          <Button href="/resume/Narihito CV.pdf" variant="primary">
            Download CV
          </Button>
        </div>
      </div>
    </div>
  );
}
