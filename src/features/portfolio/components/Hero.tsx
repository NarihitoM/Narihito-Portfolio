"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY, SplitText } from "@/shared/lib/gsap";
import { Button } from "@/shared/components/ui/Button";
import { AuraBackground } from "@/shared/components/ui/AuraBackground";
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
          onComplete: () => split.revert(),
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
    <section ref={sectionRef} className="relative flex flex-col justify-center w-full bg-bg-alt pt-[76px] min-h-[720px] lg:block lg:pt-0 lg:min-h-0 lg:h-[900px] overflow-hidden">
      <AuraBackground />

      <div className="pointer-events-none absolute inset-0">
        <SnakeGridOverlay />
      </div>

      <div className="relative z-10 mx-5 md:mx-10 lg:mx-auto lg:mt-[110px] lg:flex lg:flex-col lg:items-center text-center lg:w-[760px] flex flex-col gap-4 md:gap-6 lg:gap-8">
        <p data-hero-fade className="font-mono text-[15px] md:text-[17px] font-medium uppercase tracking-[3px] text-cyan">
          HEIN HTET AUNG · FULL-STACK &amp; AGENTIC AI DEVELOPER
        </p>

        <h1
          ref={headlineRef}
          data-hero-fade
          className="font-display text-[42px] md:text-[58px] lg:text-[76px] font-semibold leading-[0.98] tracking-[-1.5px] md:tracking-[-2px] lg:tracking-[-3px] text-text-primary lg:w-[760px]"
        >
          A Developer who turn rough ideas
          into shipped products.
        </h1>

        <p data-hero-fade className="font-body text-[15px] md:text-[17px] leading-[1.6] text-text-secondary lg:max-w-[520px]">
          Full-stack web apps builder who built front to back with React, Next.js and Node,
          plus AI features that pull their weight in production.
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

      <div className="hidden lg:flex absolute z-10 left-1/2 -translate-x-1/2 top-[620px] flex-col items-center gap-10">
        <div className="flex items-center justify-center gap-14">
          <MetaItem label="STATUS" value="OPEN FOR WORK" />
          <MetaItem label="BASED IN" value="MYANMAR" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[11px] text-text-muted">SCROLL</span>
          <ScrollMouseIcon className="h-9 w-5" dotClassName="h-1.5 w-1.5" />
        </div>
      </div>

      <div className="relative z-10 flex lg:hidden items-center justify-center mx-5 md:mx-10 mt-6 gap-10 md:gap-14">
        <MetaItem label="STATUS" value="OPEN FOR WORK" />
        <MetaItem label="BASED IN" value="MYANMAR" />
      </div>

      <div className="relative z-10 flex lg:hidden flex-col items-center gap-2 pt-4 pb-8">
        <span className="font-mono text-[10px] text-text-muted">SCROLL</span>
        <ScrollMouseIcon className="h-7 w-4" dotClassName="h-1 w-1" />
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
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
