"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap } from "@/shared/lib/gsap";
import { scrollToTarget } from "@/shared/lib/lenis";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/shared/components/ui/Button";

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Testimonials", "Contact"];
const HEADER_OFFSET = -72;

export function HeaderNav() {
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      if (!drawer) return;

      if (menuOpen) {
        gsap.set(drawer, { display: "flex" });
        gsap.fromTo(
          drawer,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.5, ease: ease.wipe },
        );
        gsap.from("[data-drawer-item]", {
          opacity: 0,
          y: 12,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.15,
          ease: ease.entrance,
        });
      } else {
        gsap.to(drawer, {
          xPercent: 100,
          duration: 0.4,
          ease: ease.wipe,
          onComplete: () => gsap.set(drawer, { display: "none" }),
        });
      }
    },
    { dependencies: [menuOpen] },
  );

  return (
    <>
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full bg-bg-panel h-[60px] md:h-[72px] flex items-center justify-between px-5 md:px-12"
    >
      <span className="font-mono text-[16px] md:text-[17px] font-semibold text-text-primary">N / H</span>

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
                className="group relative font-body text-[14px] font-medium text-text-secondary"
              >
                {link}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-text-primary transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <ModeToggle />
        <Button href="/resume.pdf" variant="primary" className="!px-5 !py-2.5 !text-[13px]">
          Resume
        </Button>
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
    <MobileDrawer drawerRef={drawerRef} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MobileDrawer({
  drawerRef,
  onClose,
}: {
  drawerRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  return (
    <div
      ref={drawerRef}
      className="fixed inset-0 z-[60] hidden flex-col items-center justify-center gap-8 bg-bg-panel-solid lg:hidden"
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-chip text-text-primary"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      {NAV_LINKS.map((link) => (
        <a
          key={link}
          data-drawer-item
          href={`#${link.toLowerCase()}`}
          onClick={(event) => {
            event.preventDefault();
            onClose();
            scrollToTarget(`#${link.toLowerCase()}`, HEADER_OFFSET);
          }}
          className="font-display text-[28px] font-semibold text-text-primary"
        >
          {link}
        </a>
      ))}
      <div data-drawer-item>
        <Button href="/resume.pdf" variant="primary">
          Resume
        </Button>
      </div>
    </div>
  );
}
