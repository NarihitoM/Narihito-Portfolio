"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
  ScrollTrigger,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Chip } from "@/shared/components/ui/Chip";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useAbout } from "@/features/about/hooks/useAbout";

export function AboutPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const { principles: PRINCIPLES, routes: ROUTE, interests: INTERESTS, isLoading, isError, refetch } = useAbout();
  const latestRouteYear = ROUTE.map((route) => route.year).sort((a, b) => b.localeCompare(a))[0] ?? "Loading";
  const pageMeta = [
    { key: "SOURCE", value: "DASHBOARD API" },
    { key: "PRINCIPLES", value: String(PRINCIPLES.length) },
    { key: "ROUTE", value: String(ROUTE.length) },
    { key: "LATEST", value: latestRouteYear },
  ];

  useGSAP(
    () => {
      registerGsap();
      const lead = leadRef.current;
      const bio = bioRef.current;
      const quote = quoteRef.current;
      if (!lead && !bio && !quote) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        if (lead) gsap.set(lead, { opacity: 1, y: 0 });
        if (bio) gsap.set(bio, { opacity: 1, y: 0 });
        if (quote) gsap.set(quote, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        if (lead) {
          gsap.fromTo(lead, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.6, ease: ease.entrance,
            scrollTrigger: { trigger: lead, once: true },
          });
        }
        if (bio) {
          gsap.fromTo(bio, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, duration: 0.6, ease: ease.entrance,
            scrollTrigger: { trigger: bio, start: "top 80%", once: true },
          });
        }
        if (quote) {
          gsap.fromTo(quote, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.6, ease: ease.entrance,
            scrollTrigger: { trigger: quote, start: "top 80%", once: true },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: contentRef },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = principlesRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6, ease: ease.entrance, stagger: 0.08,
          scrollTrigger: { trigger: container, start: "top 78%", once: true },
        });
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [PRINCIPLES] },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = routeRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 16 }, {
          opacity: 1, y: 0, duration: 0.5, ease: ease.entrance, stagger: 0.1,
          scrollTrigger: { trigger: container, start: "top 75%", once: true },
        });
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [ROUTE] },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = interestsRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, scale: 1 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const chips = container.querySelectorAll("[data-chip]");
        if (chips.length) {
          gsap.fromTo(chips, { opacity: 0, scale: 0.9 }, {
            opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)", stagger: 0.04,
            scrollTrigger: { trigger: container, start: "top 80%", once: true },
          });
        }
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [INTERESTS] },
  );

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / ABOUT"
      eyebrow="[ 01 — ABOUT ]"
      title="A developer who treats motion as structure, not decoration."
      deck="Five years of building interfaces in Bangkok — how I got here, how I work, and what I care about when the deadline is close."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "HOME", title: "Portfolio index", href: "/" }}
      next={{ direction: "NEXT →", title: "Skills & tech stack", href: "/skills" }}
    >
      <div ref={contentRef} className="flex flex-col gap-12 md:gap-20">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.6] text-text-primary"
        >
          I am Narihito — a full stack developer from Yangon. I build product
          interfaces where the animation carries meaning: a transition that explains where a
          panel came from, a stagger that tells you the list has order, a scroll cue that
          makes the page feel alive.
        </p>

        <div ref={bioRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
          <p className="font-body text-[15px] md:text-[16px] leading-[1.65] text-text-secondary">
            I started on the wrong side of the stack. Two years of PHP and MySQL for a
            logistics firm taught me that a fast query means nothing if the screen it feeds
            is confusing. So I moved toward the browser, first with vanilla JS, then React,
            and eventually Next.js — where the server and the client feel like parts of the
            same system instead of two teams that email each other.
          </p>
          <p className="font-body text-[15px] md:text-[16px] leading-[1.65] text-text-secondary">
            Motion came later and by accident — a client wanted a hero that &quot;felt
            alive&quot; and I spent a weekend inside GSAP timelines. What stuck was not the
            effect but the discipline: every eased value is a decision about what the user
            should notice first. That idea now touches every project I ship.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-16">
          <div className="relative w-full md:w-[460px] shrink-0 h-[420px] md:h-[580px] overflow-hidden rounded bg-portrait">
            <Image
              src="/HeinHtetAung.jpg"
              alt="Hein Htet Aung"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 460px, 100vw"
            />
          </div>

          <div ref={principlesRef} className="flex flex-col gap-0 flex-1">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[3px] text-violet mb-6">
              HOW I WORK
            </p>
            {isLoading ? (
              <div className="flex flex-col gap-4 py-5">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : (
              PRINCIPLES.map((p) => (
                <div
                  key={p.key}
                  className="flex gap-5 py-5 border-t border-border-glow-soft"
                >
                  <span className="font-mono text-[13px] text-text-muted shrink-0 pt-0.5">
                    {p.key}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-[17px] font-semibold text-text-primary">
                      {p.title}
                    </h3>
                    <p className="font-body text-[14px] leading-[1.55] text-text-secondary">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div ref={routeRef} className="flex flex-col gap-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[3px] text-violet">
            THE ROUTE HERE
          </p>
          {isLoading ? (
            <div className="flex flex-col gap-4 py-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : (
            ROUTE.map((r) => (
              <div
                key={r.id}
                className="flex gap-6 md:gap-10 py-5 border-t border-border-glow-soft"
              >
                <span className="font-mono text-[13px] text-text-muted shrink-0 w-12">
                  {r.year}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-[17px] font-semibold text-text-primary">
                    {r.title}
                  </h3>
                  <p className="font-body text-[14px] leading-[1.55] text-text-secondary max-w-[640px]">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div ref={interestsRef} className="flex flex-col gap-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[3px] text-violet">
            OFF THE CLOCK
          </p>
          <p className="font-body text-[15px] text-text-secondary">
            Things that keep the work honest — and occasionally end up in it.
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <span key={interest} data-chip>
                <Chip>{interest}</Chip>
              </span>
            ))}
          </div>
        </div>

        <blockquote
          ref={quoteRef}
          className="border-l-2 border-violet pl-6 md:pl-10 py-2 flex flex-col gap-3"
        >
          <p className="font-display text-[22px] md:text-[28px] lg:text-[32px] font-semibold leading-[1.3] tracking-[-0.5px] text-text-primary">
            &ldquo;The interface should feel like it was already there and you just
            arrived.&rdquo;
          </p>
          <cite className="font-mono text-[12px] text-text-muted not-italic">
            — A note I keep pinned above the monitor
          </cite>
        </blockquote>
      </div>
    </PageLayout>
  );
}