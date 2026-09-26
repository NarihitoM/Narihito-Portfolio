"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

export function DetailCta({
  href,
  align = "center",
}: {
  href: string;
  route?: string;
  align?: "center" | "start" | "end";
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const justify = align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";

  useGSAP(
    () => {
      registerGsap();
      const el = wrapperRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(el, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ease.entrance,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className={`flex ${justify}`}>
      <Link
        href={href}
        className="group inline-flex h-12 md:h-10 w-full md:w-auto items-center justify-center gap-1.5 rounded-[4px] border border-border-glow-soft px-[18px] md:px-4 font-body fs-13 font-medium text-text-primary transition-[color,transform,background-color] duration-150 ease-out hover:bg-fill-glow-soft active:scale-95 active:text-violet"
      >
        See more
        <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 group-active:translate-x-1.5">→</span>
      </Link>
    </div>
  );
}
