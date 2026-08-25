"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY, SplitText } from "@/shared/lib/gsap";
import { SectionEyebrow } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { ImageLightbox } from "@/shared/components/ui/ImageLightbox";
import { StatItem } from "@/shared/components/ui/StatItem";
import { useStats } from "@/features/about/hooks/useAbout";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { data: stats } = useStats();

  useGSAP(
    () => {
      registerGsap();
      const body = bodyRef.current;
      if (!body) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(body, { opacity: 1 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const split = new SplitText(body, { type: "lines" });
        gsap.from(split.lines, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: ease.entrance,
          stagger: 0.06,
          scrollTrigger: { trigger: body },
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="about" ref={sectionRef} className="w-full bg-bg py-14 md:py-16 lg:py-0 lg:h-[780px]">
      <div className="mx-5 md:mx-10 lg:mx-auto flex flex-col md:flex-row md:items-center gap-8 md:gap-10 lg:gap-[120px] md:h-full lg:max-w-[1400px] lg:justify-center">
        <div className="relative w-full md:w-[240px] lg:w-[380px] h-[340px] md:h-[300px] lg:h-[460px] shrink-0">
          <div className="absolute left-[28px] top-[28px] h-full w-full border border-border-glow" />
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="View profile photo"
            className="relative h-full w-full md:h-[280px] md:w-[220px] lg:h-[440px] lg:w-[360px] overflow-hidden bg-portrait cursor-pointer transition-transform active:scale-[0.98]"
          >
            <Image
              src="/HeinHtetAung.jpg"
              alt="Hein Htet Aung"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 360px, (min-width: 768px) 220px, 100vw"
              priority
            />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 md:gap-6 min-w-0 flex-1 lg:max-w-[600px]">
          <SectionEyebrow>01 - ABOUT</SectionEyebrow>
          <h2 className="font-display text-[30px] md:text-[36px] lg:text-[44px] font-semibold leading-[1.14] tracking-[-1px] md:tracking-[-1.2px] lg:tracking-[-1.4px] text-text-primary">
            I&apos;m Hein Htet Aung, a full-stack developer who builds AI-native products.
          </h2>
          <p ref={bodyRef} className="font-body text-[15px] md:text-[16px] lg:text-[17px] leading-[1.65] text-text-secondary">
            I&apos;m 21 and a 2nd-year Software Engineering / Computer Science student at the
            University of Information Technology. Alongside my studies, I design and build
            full-stack web applications end to end, React and Next.js on the front, Node and
            Postgres underneath, and wire in AI integrations that actually hold up in production,
            not just a demo.
          </p>

          {stats && (
            <div className="flex items-center gap-8 md:gap-10 pt-2 md:pt-4">
              <StatItem value={stats.yearsExperience} suffix="+" label="Years Experience" />
              <StatItem value={stats.projectsCount} suffix="+" label="Projects" />
              <StatItem value={stats.satisfiedRate} suffix="%" label="Satisfied Rate" />
            </div>
          )}

          <DetailCta href="/about" route="/about" />
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          src="/HeinHtetAung.jpg"
          alt="Hein Htet Aung"
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
