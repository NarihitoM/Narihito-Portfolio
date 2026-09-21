"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ease, gsap, registerGsap, ScrollTrigger } from "@/shared/lib/gsap";

const TAGLINE = "Full-Stack & Agentic AI Developer";
const NAME = "NARIHITO";
const BAR_MS = 2000;
const READY_FALLBACK_MS = 3000;
const LETTER_STAGGER = 0.045;

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
    const root = rootRef.current;
    const name = nameRef.current;
    const tagline = taglineRef.current;
    if (!ready || !root || !name || !tagline) return;

    const nameLetters = name.querySelectorAll("[data-preload-letter]");
    const taglineLetters = tagline.querySelectorAll("[data-preload-letter]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(root, { opacity: 1 });
      gsap.set([nameLetters, taglineLetters], { opacity: 1 });
      requestAnimationFrame(() => setTaglineDone(true));
      return;
    }

    registerGsap();
    gsap.set(nameLetters, { y: 10 });
    gsap.set(taglineLetters, { y: 8 });
    gsap
      .timeline()
      .to(root, { opacity: 1, duration: 0.4, ease: ease.entrance })
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
    const root = rootRef.current;
    if (!root || !taglineDone) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => {
        setDone(true);
      });
      return;
    }

    const finish = () => {
      registerGsap();
      gsap.to(root, {
        yPercent: -100,
        duration: 0.7,
        ease: ease.entrance,
        onComplete: () => {
          setDone(true);
          ScrollTrigger.refresh();
        },
      });
    };

    const fallback = window.setTimeout(finish, BAR_MS + 300);

    return () => {
      window.clearTimeout(fallback);
      gsap.killTweensOf(root);
    };
  }, [taglineDone]);

  if (done) return null;

  return (
    <div
      id="preloader"
      ref={rootRef}
      className="fixed inset-0 z-120 flex flex-col items-center justify-center gap-8 bg-bg opacity-0"
    >
      <div className="flex flex-col items-center gap-5">
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
        <span ref={nameRef} className="font-display text-[28px] font-bold uppercase tracking-[6px] text-text-primary">
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

      <div className="flex h-[36px] w-70 flex-col gap-4">
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
  );
}
