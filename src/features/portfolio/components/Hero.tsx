"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY, SplitText } from "@/shared/lib/gsap";
import { Button } from "@/shared/components/ui/Button";
import { HeroSphere } from "@/features/portfolio/three/HeroSphere";
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
      <div className="relative mx-5 md:mx-10 mt-9 mb-11 h-[200px] md:h-[260px] bg-surface lg:absolute lg:inset-auto lg:right-[120px] lg:top-[150px] lg:mx-0 lg:my-0 lg:h-[400px] lg:w-[400px]">
        <HeroSphere />
      </div>

      <div className="mx-5 md:mx-10 lg:mx-0 lg:absolute lg:left-[120px] lg:top-[236px] flex flex-col gap-4 md:gap-6 lg:gap-8 lg:w-[760px]">
        <p data-hero-fade className="font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[3px] text-cyan">
          <span className="lg:hidden">
            HEIN HTET AUNG — FULL-STACK
            <br />
            DEVELOPER, AI INTEGRATIONS
          </span>
          <span className="hidden lg:inline">HEIN HTET AUNG — FULL-STACK DEVELOPER, AI INTEGRATIONS</span>
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
          Building faster, writing cleaner code, and shipping sooner — from data models to the
          pixel that reacts to your <span className="lg:hidden">touch</span>
          <span className="hidden lg:inline">cursor</span>.
        </p>

        <div data-hero-fade className="flex flex-col sm:flex-row gap-2.5 md:gap-4">
          <Button href="#projects" variant="primary" className="w-full sm:w-auto h-[52px] md:h-auto">
            View Projects
          </Button>
          <Button href="#contact" variant="secondary" className="w-full sm:w-auto h-[52px] md:h-auto">
            Contact Me
          </Button>
        </div>
      </div>

      <div className="hidden lg:block absolute left-[120px] top-[838px] h-px w-[1200px] bg-border-glow-soft" />

      <div className="hidden lg:grid absolute left-[400px] top-[860px] w-[920px] grid-cols-3 gap-8">
        <MetaItem label="AVAILABLE" value="EVERY TIME" />
        <MetaItem label="BASED IN" value="MYANMAR" />
        <MetaItem label="FOCUS" value="FULL STACK DEVELOPMENT · AI DEVELOPMENT" />
      </div>

      <div className="hidden lg:flex absolute left-[120px] top-[860px] flex-col items-center gap-3">
        <span className="font-mono text-[11px] text-text-muted">SCROLL</span>
        <span className="h-9 w-px bg-cyan" />
      </div>

      <div className="flex lg:hidden flex-col items-center gap-2 py-8">
        <span className="font-mono text-[10px] text-text-muted">SCROLL</span>
        <span className="h-7 w-px bg-cyan" />
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
