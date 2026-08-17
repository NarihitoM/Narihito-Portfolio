"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, SplitText } from "@/shared/lib/gsap";
import { Button } from "@/shared/components/ui/Button";
import { HeroSphere } from "@/features/portfolio/three/HeroSphere";

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

      mm.add(`not ${REDUCED_MOTION_QUERY}`, () => {
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
    <section ref={sectionRef} className="relative w-full bg-bg-alt pt-[76px] md:pt-0 md:h-[940px] overflow-hidden">
      <div className="hidden md:block absolute right-[120px] top-[150px] h-[576px] w-[576px] bg-surface">
        <HeroSphere />
      </div>

      <div className="flex flex-col md:hidden mx-5 mt-9 mb-11 h-[300px] bg-surface relative">
        <HeroSphere />
      </div>

      <div className="mx-5 md:mx-0 md:absolute md:left-[120px] md:top-[236px] flex flex-col gap-4 md:gap-8 md:w-[760px]">
        <p data-hero-fade className="font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[3px] text-cyan">
          <span className="md:hidden">
            NARIHITO — FULL-STACK
            <br />
            SOFTWARE DEVELOPER
          </span>
          <span className="hidden md:inline">NARIHITO — FULL-STACK SOFTWARE DEVELOPER</span>
        </p>

        <h1
          ref={headlineRef}
          data-hero-fade
          className="font-display text-[42px] md:text-[76px] font-semibold leading-[0.98] tracking-[-1.5px] md:tracking-[-3px] text-text-primary md:w-[660px]"
        >
          Building interfaces
          <br />
          that feel alive.
        </h1>

        <p data-hero-fade className="font-body text-[15px] md:text-[17px] leading-[1.6] text-text-secondary md:w-[520px]">
          I design and build performant, motion-rich web products end to end — from data models to the pixel that
          reacts to your <span className="md:hidden">touch</span>
          <span className="hidden md:inline">cursor</span>.
        </p>

        <div data-hero-fade className="flex flex-col md:flex-row gap-2.5 md:gap-4">
          <Button href="#projects" variant="primary" className="w-full md:w-auto h-[52px] md:h-auto">
            View Projects
          </Button>
          <Button href="#contact" variant="secondary" className="w-full md:w-auto h-[52px] md:h-auto">
            Contact Me
          </Button>
        </div>
      </div>

      <div className="hidden md:block absolute left-[120px] top-[838px] h-px w-[1200px] bg-border-glow-soft" />

      <div className="hidden md:grid absolute left-[400px] top-[860px] w-[920px] grid-cols-3 gap-8">
        <MetaItem label="AVAILABLE" value="MAR 2026" />
        <MetaItem label="BASED IN" value="TOKYO REMOTE" />
        <MetaItem label="FOCUS" value="MOTION · 3D · PERF" />
      </div>

      <div className="hidden md:flex absolute left-[120px] top-[860px] flex-col items-center gap-3">
        <span className="font-mono text-[11px] text-text-muted">SCROLL</span>
        <span className="h-9 w-px bg-cyan" />
      </div>

      <div className="flex md:hidden flex-col items-center gap-2 py-8">
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
