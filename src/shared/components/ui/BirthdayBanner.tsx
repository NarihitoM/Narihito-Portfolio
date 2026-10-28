"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Cake } from "lucide-react";

const NAME = "Narihito";
const BIRTH_YEAR = 2005;
const BIRTH_MONTH = 10;
const BIRTH_DAY = 28;
const TIME_ZONE = "Asia/Yangon";
const REPEAT = 10;
const SUFFIXES: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };

function subscribe() {
  return () => {};
}

function getAge() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  const isBirthday = part("month") === BIRTH_MONTH && part("day") === BIRTH_DAY;
  return isBirthday ? part("year") - BIRTH_YEAR : 0;
}

function getServerAge() {
  return 0;
}

function ordinal(n: number) {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  return `${n}${SUFFIXES[n % 10] ?? "th"}`;
}

export function BirthdayBanner() {
  const age = useSyncExternalStore(subscribe, getAge, getServerAge);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!age || !banner) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty("--birthday-banner", `${banner.offsetHeight}px`);
    });
    observer.observe(banner);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--birthday-banner");
    };
  }, [age]);

  if (!age) return null;

  const headline = `Today is ${NAME}'s ${ordinal(age)} Birthday!`;

  return (
    <div
      ref={bannerRef}
      role="status"
      className="fixed inset-x-0 top-0 z-[54] h-8 overflow-hidden bg-violet text-wire md:h-9"
    >
      <span className="sr-only">{headline}</span>
      <div aria-hidden className="animate-headline-ticker flex h-full w-max items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {Array.from({ length: REPEAT }, (_, i) => (
              <span
                key={i}
                className="flex items-center gap-3 whitespace-nowrap px-6 font-mono text-[11px] font-medium uppercase tracking-[2px] md:text-[12px]"
              >
                <Cake size={14} className="shrink-0" />
                {headline}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
