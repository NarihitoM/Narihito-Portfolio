"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY, SplitText } from "@/shared/lib/gsap";
import { Button } from "@/shared/components/ui/Button";
import { SnakeGridOverlay } from "@/features/portfolio/three/SnakeGridOverlay";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const headline = headlineRef.current;
      if (!headline) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(headline, { opacity: 1 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const split = new SplitText(headline, { type: "lines" });
        gsap.from(split.lines, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: ease.splitReveal,
          stagger: 0.09,
        });

        gsap.from("[data-hero-fade]", {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: ease.entrance,
          stagger: 0.06,
          delay: 0.3,
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative w-full bg-bg-alt pt-[76px] lg:pt-0 lg:h-[940px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <SnakeGridOverlay />
      </div>

      <div className="mx-5 md:mx-10 lg:mx-auto lg:mt-[200px] lg:flex lg:flex-col lg:items-center text-center lg:w-[760px] flex flex-col gap-4 md:gap-6 lg:gap-8">
        <p data-hero-fade className="font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[3px] text-cyan">
          <span className="lg:hidden">
            HEIN HTET AUNG - FULL-STACK
            <br />
            DEVELOPER, AI INTEGRATIONS
          </span>
          <span className="hidden lg:inline">HEIN HTET AUNG - FULL-STACK DEVELOPER, AI INTEGRATIONS</span>
        </p>

        <h1
          ref={headlineRef}
          data-hero-fade
          className="font-display text-[42px] md:text-[58px] lg:text-[76px] font-semibold leading-[0.98] tracking-[-1.5px] md:tracking-[-2px] lg:tracking-[-3px] text-text-primary lg:w-[660px]"
        >
          Building interfaces
          <br />
          that feel alive.
        </h1>

        <p data-hero-fade className="font-body text-[15px] md:text-[17px] leading-[1.6] text-text-secondary lg:max-w-[520px]">
          Building faster, writing cleaner code, and shipping sooner, with the trust, security,
          and performance clients can build on.
        </p>

        <div data-hero-fade className="flex flex-col sm:flex-row justify-center gap-2.5 md:gap-4">
          <Button href="#projects" variant="primary" className="w-full sm:w-auto h-[52px] md:h-auto">
            View Projects
          </Button>
          <Button href="#contact" variant="secondary" className="w-full sm:w-auto h-[52px] md:h-auto">
            Contact Me
          </Button>
        </div>
      </div>

      <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-[838px] h-px w-[1200px] bg-border-glow-soft" />
      <div className="lg:hidden mx-5 md:mx-10 mt-8 h-px w-full bg-border-glow-soft" />

      <div className="hidden lg:grid absolute left-1/2 -translate-x-1/2 top-[860px] w-[920px] grid-cols-3 gap-8">
        <MetaItem label="AVAILABLE" value="EVERY TIME" />
        <MetaItem label="BASED IN" value="MYANMAR" />
        <MetaItem label="FOCUS" value="FULL STACK DEVELOPMENT · AI DEVELOPMENT" />
      </div>

      <div className="grid lg:hidden mx-5 md:mx-10 mt-6 grid-cols-3 gap-4">
        <MetaItem label="AVAILABLE" value="EVERY TIME" />
        <MetaItem label="BASED IN" value="MYANMAR" />
        <MetaItem label="FOCUS" value="FULL STACK DEVELOPMENT · AI DEVELOPMENT" />
      </div>

      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-[860px] flex-col items-center gap-3">
        <span className="font-mono text-[11px] text-text-muted">SCROLL</span>
        <ScrollMouseIcon className="h-9 w-5" dotClassName="h-1.5 w-1.5" />
      </div>

      <div className="flex lg:hidden flex-col items-center gap-2 py-8">
        <span className="font-mono text-[10px] text-text-muted">SCROLL</span>
        <ScrollMouseIcon className="h-7 w-4" dotClassName="h-1 w-1" />
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] text-text-muted">{label}</span>
      <span className="font-mono text-[12px] text-text-secondary">{value}</span>
    </div>
  );
}

function ScrollMouseIcon({ className, dotClassName }: { className: string; dotClassName: string }) {
  return (
    <div className={`flex justify-center rounded-full border border-cyan pt-2 ${className}`}>
      <span className={`animate-scroll-dot rounded-full bg-cyan ${dotClassName}`} />
    </div>
  );
}
