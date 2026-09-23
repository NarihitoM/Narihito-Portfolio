"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ease, gsap, registerGsap, ScrollTrigger } from "@/shared/lib/gsap";

const TAGLINE = "Full-Stack & Agentic AI Developer";
const NAME = "NARIHITO";
const BAR_MS = 2000;
const READY_FALLBACK_MS = 3000;
const LETTER_STAGGER = 0.045;
const PANEL_DURATION = 0.6;

function subscribeLoad(onStoreChange: () => void) {
  window.addEventListener("load", onStoreChange);
  return () => window.removeEventListener("load", onStoreChange);
}

function getLoaded() {
  return document.readyState === "complete";
}

function getServerLoaded() {
  return false;
}

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const leftLeafRef = useRef<HTMLDivElement>(null);
  const rightLeafRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const scrollYRef = useRef(0);
  const [done, setDone] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [taglineDone, setTaglineDone] = useState(false);
  const loaded = useSyncExternalStore(subscribeLoad, getLoaded, getServerLoaded);
  const ready = loaded || timedOut;

  useEffect(() => {
    const fallback = window.setTimeout(() => setTimedOut(true), READY_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    const name = nameRef.current;
    const tagline = taglineRef.current;
    if (!ready || !content || !name || !tagline) return;

    const nameLetters = name.querySelectorAll("[data-preload-letter]");
    const taglineLetters = tagline.querySelectorAll("[data-preload-letter]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(content, { opacity: 1 });
      gsap.set([nameLetters, taglineLetters], { opacity: 1 });
      requestAnimationFrame(() => setTaglineDone(true));
      return;
    }

    registerGsap();
    gsap.set(nameLetters, { y: 10 });
    gsap.set(taglineLetters, { y: 8 });
    gsap
      .timeline({ delay: 0.3 })
      .to(content, { opacity: 1, duration: 0.5, ease: ease.entrance })
      .to(nameLetters, { opacity: 1, y: 0, duration: 0.3, stagger: LETTER_STAGGER, ease: ease.entrance })
      .to(taglineLetters, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        stagger: LETTER_STAGGER,
        ease: ease.entrance,
        onComplete: () => setTaglineDone(true),
      });
  }, [ready]);

  useEffect(() => {
    if (done) return;
    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [done]);

  useEffect(() => {
    const content = contentRef.current;
    const bar = barRef.current;
    const leftLeaf = leftLeafRef.current;
    const rightLeaf = rightLeafRef.current;
    if (!content || !bar || !leftLeaf || !rightLeaf || !taglineDone) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => {
        setDone(true);
      });
      return;
    }

    const finish = () => {
      registerGsap();
      gsap
        .timeline({
          onComplete: () => {
            setDone(true);
            ScrollTrigger.refresh();
          },
        })
        .to([content, bar], { opacity: 0, scale: 0.94, duration: 0.2, ease: ease.interaction })
        .to(leftLeaf, { xPercent: -100, duration: PANEL_DURATION, ease: ease.wipe })
        .to(rightLeaf, { xPercent: 100, duration: PANEL_DURATION, ease: ease.wipe }, "<");
    };

    const fallback = window.setTimeout(finish, BAR_MS + 300);

    return () => {
      window.clearTimeout(fallback);
      gsap.killTweensOf([leftLeaf, rightLeaf, content, bar]);
    };
  }, [taglineDone]);

  if (done) return null;

  return (
    <div id="preloader" ref={rootRef} className="fixed inset-0 z-120 overflow-hidden">
      <div ref={leftLeafRef} className="absolute inset-y-0 left-0 w-1/2 bg-bg" />
      <div ref={rightLeafRef} className="absolute inset-y-0 right-0 w-1/2 bg-bg" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
      <div ref={contentRef} className="flex flex-col items-center gap-5 opacity-0">
        <div className="h-14 w-14 overflow-hidden rounded-full md:h-16 md:w-16">
          <Image
            src="/img/Narihito.jpg"
            alt="Narihito"
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <span ref={nameRef} className="whitespace-nowrap font-display fs-28 font-bold uppercase tracking-[4px] text-text-primary sm:tracking-[6px]">
          {NAME.split("").map((letter, i) => (
            <span key={i} data-preload-letter className="inline-block opacity-0">
              {letter}
            </span>
          ))}
        </span>
        <span ref={taglineRef} className="font-mono text-[10px] font-light tracking-[2px] text-text-secondary uppercase">
          {TAGLINE.split("").map((letter, i) => (
            <span key={i} data-preload-letter className="inline-block opacity-0">
              {letter === " " ? " " : letter}
            </span>
          ))}
        </span>
      </div>

      <div ref={barRef} className="flex h-[36px] w-70 flex-col gap-4">
        {taglineDone && (
          <>
            <div className="h-px w-full overflow-hidden bg-border-glow-soft">
              <span className="preload-bar block h-full w-full origin-left bg-text-primary" />
            </div>
            <div className="relative h-4 w-full">
              <span className="preload-counter absolute top-0 left-0 -translate-x-1/2 font-mono text-[11px] tracking-[2px] whitespace-nowrap text-text-secondary" />
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
