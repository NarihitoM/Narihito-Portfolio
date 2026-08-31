"use client";

import { useRef, useState } from "react";
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
import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { ImageLightbox } from "@/shared/components/ui/ImageLightbox";
import { usePrinciples, useRoutes, useInterests, useStats } from "@/features/about/hooks/useAbout";
import { yearsOfExperience } from "@/shared/lib/experience";
import { StatItem, StatItemSkeleton } from "@/shared/components/ui/StatItem";

export function AboutPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const {
    principles: PRINCIPLES,
    total: principlesTotal,
    isLoading: principlesLoading,
    isError: principlesError,
    refetch: refetchPrinciples,
    hasNextPage: hasMorePrinciples,
    isFetchingNextPage: loadingMorePrinciples,
    fetchNextPage: loadMorePrinciples,
  } = usePrinciples();
  const {
    routes: ROUTE,
    total: routeTotal,
    isLoading: routeLoading,
    isError: routeError,
    refetch: refetchRoutes,
    hasNextPage: hasMoreRoutes,
    isFetchingNextPage: loadingMoreRoutes,
    fetchNextPage: loadMoreRoutes,
  } = useRoutes();
  const {
    interests: INTERESTS,
    isLoading: interestsLoading,
    isError: interestsError,
    refetch: refetchInterests,
    hasNextPage: hasMoreInterests,
    isFetchingNextPage: loadingMoreInterests,
    fetchNextPage: loadMoreInterests,
  } = useInterests();
  const { data: stats, isLoading: statsLoading } = useStats();
  const isLoading = principlesLoading || routeLoading || interestsLoading;
  const isError = principlesError || routeError || interestsError;
  const latestRouteYear = ROUTE.map((route) => route.year).sort((a, b) => b.localeCompare(a))[0] ?? "Loading";
  const pageMeta = [
    { key: "SOURCE", value: "NARIHITO" },
    { key: "PRINCIPLES", value: String(principlesTotal) },
    { key: "ROUTE", value: String(routeTotal) },
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
        if (!PRINCIPLES.length) {
          gsap.set(container.children, { opacity: 1, y: 0 });
          return;
        }

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
        if (!ROUTE.length) {
          gsap.set(container.children, { opacity: 1, y: 0 });
          return;
        }

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
      backLink="Back To Portfolio"
      backHref="/"
      breadcrumb="HOME / ABOUT"
      eyebrow="[ 01 - ABOUT ]"
      title="The person behind the projects, and how I like to work."
      deck={`${yearsOfExperience(stats?.yearsExperience ?? 0)} of building for the web apps from Yangon. My principles, the road that got me here, and what I do off the clock.`}
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "PORTFOLIO", title: "Portfolio index", href: "/" }}
      next={{ direction: "NEXT →", title: "Skills & tech stack", href: "/skills" }}
    >
      <div ref={contentRef} className="flex flex-col gap-12 md:gap-20">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.6] text-text-primary"
        >
          I&apos;m Hein Htet Aung, aka Narihito, a full-stack and agentic AI developer based in Yangon. I obsess
          over the parts users never see: fast queries, sensible state, and interfaces that
          stay clear even when the data underneath gets messy.
        </p>

        {statsLoading ? (
          <div className="flex items-center gap-10 md:gap-16">
            <StatItemSkeleton />
            <StatItemSkeleton />
            <StatItemSkeleton />
          </div>
        ) : stats ? (
          <div className="flex items-center gap-10 md:gap-16">
            <StatItem value={stats.yearsExperience} suffix="+" label="Years Experience" />
            <StatItem value={stats.projectsCount} suffix="+" label="Projects" />
            <StatItem value={stats.satisfiedRate} suffix="%" label="Satisfied Rate" />
          </div>
        ) : null}

        <div ref={bioRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
          <p className="font-body text-[15px] md:text-[16px] leading-[1.65] text-text-secondary">
            My first year was HTML and CSS, and static pages quickly felt like a
            ceiling rather than a craft. So I turned toward backend work instead,
            databases and server logic for a logistics firm, and learned that a
            fast query means nothing if the screen it feeds is confusing. That
            pulled me back to the browser: vanilla JS first, then React, then
            Next.js, where server and client finally felt like one system.
            Lately my focus has shifted toward agentic AI development.
          </p>
          <p className="font-body text-[15px] md:text-[16px] leading-[1.65] text-text-secondary">
            These days I&apos;m working through machine learning fundamentals and the
            engineering habits that only matter at scale: system design, testing
            discipline, architecture that survives a team growing around it. It is
            a slower kind of progress than shipping a feature, but it is the
            foundation I want under everything I build next.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-16">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="View profile photo"
            className="relative w-full md:w-[460px] shrink-0 h-[420px] md:h-[580px] overflow-hidden rounded bg-portrait cursor-pointer transition-transform active:scale-[0.98]"
          >
            <Image
              src="/img/HeinHtetAung.jpg"
              alt="Hein Htet Aung"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 460px, 100vw"
            />
          </button>

          <div ref={principlesRef} className="flex flex-col gap-0 flex-1">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[3px] text-violet mb-6">
              HOW I WORK
            </p>
            {principlesLoading ? (
              <div className="flex flex-col gap-4 py-5">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : principlesError ? (
              <ErrorState onRetry={refetchPrinciples} />
            ) : (
              <>
                {PRINCIPLES.map((p) => (
                  <div
                    key={p.id}
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
                ))}
                {hasMorePrinciples && (
                  <LoadMoreButton
                    onClick={() => loadMorePrinciples()}
                    loading={loadingMorePrinciples}
                    label="LOAD MORE"
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div ref={routeRef} className="flex flex-col gap-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[3px] text-violet">
            THE ROUTE HERE
          </p>
          {routeLoading ? (
            <div className="flex flex-col gap-4 py-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : routeError ? (
            <ErrorState onRetry={refetchRoutes} />
          ) : (
            <>
              {ROUTE.map((r) => (
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
              ))}
              {hasMoreRoutes && (
                <LoadMoreButton onClick={() => loadMoreRoutes()} loading={loadingMoreRoutes} label="LOAD MORE" />
              )}
            </>
          )}
        </div>

        <div ref={interestsRef} className="flex flex-col gap-5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[3px] text-violet">
            OFF THE CLOCK
          </p>
          <p className="font-body text-[15px] text-text-secondary">
            Hobbies that recharge me, and occasionally sneak their way into the work.
          </p>
          {interestsError ? (
            <ErrorState onRetry={refetchInterests} />
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <span key={interest.id} data-chip>
                    <Chip>{interest.label}</Chip>
                  </span>
                ))}
              </div>
              {hasMoreInterests && (
                <LoadMoreButton
                  onClick={() => loadMoreInterests()}
                  loading={loadingMoreInterests}
                  label="LOAD MORE"
                />
              )}
            </>
          )}
        </div>

        <blockquote
          ref={quoteRef}
          className="border-l-2 border-violet pl-6 md:pl-10 py-2 flex flex-col gap-3"
        >
          <p className="font-display text-[22px] md:text-[28px] lg:text-[32px] font-semibold leading-[1.3] tracking-[-0.5px] text-text-primary">
            &ldquo;The best opportunity you can get is in your hands&rdquo;
          </p>
          <cite className="font-mono text-[12px] text-text-muted not-italic">
            A rule I try to build by.
          </cite>
        </blockquote>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          src="/img/HeinHtetAung.jpg"
          alt="Hein Htet Aung"
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </PageLayout>
  );
}