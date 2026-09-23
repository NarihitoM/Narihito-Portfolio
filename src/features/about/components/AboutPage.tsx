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
import { GitHubContributions } from "@/features/about/components/GitHubContributions";
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
      eyebrow="01 - ABOUT"
      title="Who I am, and how I like to build things."
      deck={`${yearsOfExperience(stats?.yearsExperience ?? 0)} building web apps from Yangon. How I got into this, what I care about when I build, and a bit about life outside work.`}
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
          I&apos;m Hein Htet Aung, most people call me Narihito. I&apos;m a full-stack
          and AI developer in Yangon. I care a lot about the boring stuff that
          makes apps feel good: fast queries, sane state, screens that still
          make sense when the data gets messy.
        </p>

        {statsLoading ? (
          <div className="flex items-center gap-10 md:gap-16">
            <StatItemSkeleton />
            <StatItemSkeleton />
            <StatItemSkeleton />
          </div>
        ) : stats ? (
          <div className="flex items-center gap-10 md:gap-16">
            <StatItem
              value={stats.yearsExperience}
              suffix="+"
              label="Years Experience"
              tooltip="How long I've been building and shipping software."
            />
            <StatItem
              value={stats.projectsCount}
              suffix="+"
              label="Projects"
              tooltip="Projects I've finished and shipped, from web apps to AI tools."
            />
            <StatItem
              value={stats.satisfiedRate}
              suffix="%"
              label="Satisfied Rate"
              tooltip="An AI assistant reads my testimonials and scores how positively people talk about working with me."
            />
          </div>
        ) : null}

        <GitHubContributions />

        <div ref={bioRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
          <p className="font-body text-[15px] md:text-[16px] leading-[1.65] text-text-secondary">
            I started with HTML and CSS, but static pages got boring fast.
            So I went backend for a while, databases and server logic for a
            logistics company, and learned the hard way that a fast query
            doesn&apos;t matter if the UI confuses everyone. That dragged me back
            to the browser: plain JS first, then React, then Next.js, where
            front and back finally clicked for me. These days I&apos;m deep into AI agents.
          </p>
          <p className="font-body text-[15px] md:text-[16px] leading-[1.65] text-text-secondary">
            Right now I&apos;m working through ML basics and the less exciting
            stuff that matters once a project grows, like system design, writing
            real tests, and architecture that holds up when more people touch it.
            It&apos;s slower than shipping features, but I want everything else I
            build to sit on top of it.
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
            <p className="font-mono text-[15px] md:text-[17px] font-medium uppercase tracking-[3px] text-violet mb-6">
              HOW I WORK
            </p>
            {principlesLoading ? (
              <>
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex gap-5 py-5 border-t border-border-glow-soft">
                    <Skeleton className="h-4 w-6 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1 flex-1">
                      <Skeleton className="h-[22px] w-2/5" />
                      <Skeleton className="h-[43px] w-full" />
                    </div>
                  </div>
                ))}
              </>

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
          <p className="font-mono text-[15px] md:text-[17px] font-medium uppercase tracking-[3px] text-violet">
            THE ROUTE HERE
          </p>
          {routeLoading ? (
            <>
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex gap-6 md:gap-10 py-5 border-t border-border-glow-soft">
                  <Skeleton className="h-4 w-12 shrink-0" />
                  <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="h-[22px] w-1/3" />
                    <Skeleton className="h-[43px] w-full max-w-[640px]" />
                  </div>
                </div>
              ))}
            </>

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
          <p className="font-mono text-[15px] md:text-[17px] font-medium uppercase tracking-[3px] text-violet">
            OFF THE CLOCK
          </p>
          <p className="font-body text-[15px] text-text-secondary">
            Stuff I do when I&apos;m not coding. Some of it sneaks into my work anyway.
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
            &ldquo;The best opportunity you can get is the one in your hands&rdquo;
          </p>
          <cite className="font-mono text-[12px] text-text-muted not-italic">
            Trying to live by that.
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