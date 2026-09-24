"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget } from "@/shared/lib/lenis";
import { HEADER_OFFSET, NAV_LINKS } from "./HeaderNav";

const REACH_LINE = 0.4;

export function SectionTracker() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.toLowerCase())).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const reach = window.innerHeight * REACH_LINE;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const stops = sections.map((section) => Math.min(y + section.getBoundingClientRect().top - reach, maxScroll));

      let progress = 0;
      for (let i = 0; i < stops.length - 1; i++) {
        if (y >= stops[i + 1]) {
          progress = i + 1;
          continue;
        }
        if (y > stops[i]) progress = i + (y - stops[i]) / (stops[i + 1] - stops[i]);
        break;
      }

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${progress / Math.max(1, stops.length - 1)})`;
      }
      setActive(Math.floor(progress));
      setVisible(y >= stops[0] - reach);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav
      aria-label="Section progress"
      className={`fixed right-0 top-1/2 z-30 -translate-y-1/2 transition-[opacity,translate] duration-500 md:right-4 lg:right-8 ${
        visible ? "opacity-100" : "pointer-events-none translate-x-4 opacity-0"
      }`}
    >
      <div className="relative">
        <span className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-border-glow" />
        <span
          ref={fillRef}
          className="absolute inset-y-3 left-1/2 w-px origin-top -translate-x-1/2 bg-text-primary"
        />
        <ul className="relative flex flex-col gap-2">
          {NAV_LINKS.map((link, i) => (
            <li key={link}>
              <button
                type="button"
                aria-label={`Go to ${link}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => scrollToTarget(`#${link.toLowerCase()}`, HEADER_OFFSET)}
                className="group relative flex h-6 w-5 items-center justify-center md:w-6"
              >
                <span
                  className={`h-2 w-2 rounded-full border transition-[scale,background-color,border-color] duration-300 ${
                    i < active
                      ? "border-text-primary bg-text-primary"
                      : i === active
                        ? "scale-150 border-text-primary bg-text-primary"
                        : "border-border-glow bg-bg group-hover:border-text-primary"
                  }`}
                />
                <span
                  className={`pointer-events-none absolute right-full mr-1.5 whitespace-nowrap rounded-full bg-bg-panel px-2.5 py-1 font-mono text-[10px] uppercase tracking-[2px] text-text-primary backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 ${
                    i === active ? "animate-tracker-label lg:animate-none lg:opacity-100" : "opacity-0"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} {link}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
