"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useTheme } from "@/shared/hooks/useTheme";
import { aboutApi } from "@/features/about/api/aboutApi";
import type { ContributionDay } from "@/features/about/types/types";

const USERNAME = "NarihitoM";
const MIN_YEAR = 2022;
const GREENS = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
} as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function describeDay(day: ContributionDay) {
  const label = new Date(`${day.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${label}`;
}

export function GitHubContributions() {
  const { theme } = useTheme();
  const levels = GREENS[theme];
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: currentYear - MIN_YEAR + 1 }, (_, i) => currentYear - i),
    [currentYear],
  );
  const [year, setYear] = useState(currentYear);
  const [days, setDays] = useState<ContributionDay[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [resetKey, setResetKey] = useState(currentYear);
  const [selected, setSelected] = useState<ContributionDay | null>(null);

  if (resetKey !== year) {
    setResetKey(year);
    setDays([]);
    setTotal(0);
    setLoading(true);
    setFailed(false);
    setSelected(null);
  }

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    aboutApi
      .getContributions(year, controller.signal)
      .then((data) => {
        if (cancelled) return;
        setDays(data.days ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {
        if (!cancelled && !controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [year]);

  const weeks = useMemo(() => {
    if (!days.length) return [];
    const byDate = new Map(days.map((day) => [day.date, day]));
    const dataYear = days[0].date.slice(0, 4);
    const cursor = new Date(`${dataYear}-01-01T00:00:00`);
    cursor.setDate(cursor.getDate() - cursor.getDay());
    const last = new Date(`${dataYear}-12-31T00:00:00`);
    const columns: (ContributionDay | null)[][] = [];
    while (cursor <= last) {
      const week: (ContributionDay | null)[] = [];
      for (let i = 0; i < 7; i++) {
        const key = toDateKey(cursor);
        week.push(
          key.startsWith(dataYear) ? byDate.get(key) ?? { date: key, count: 0, level: 0 } : null,
        );
        cursor.setDate(cursor.getDate() + 1);
      }
      columns.push(week);
    }
    return columns;
  }, [days]);

  const monthLabels = useMemo(
    () =>
      weeks.map((week, i) => {
        const firstDay = week.find((day) => day !== null);
        if (!firstDay) return "";
        const month = Number(firstDay.date.slice(5, 7)) - 1;
        if (i === 0) return MONTHS[month];
        const prevFirst = weeks[i - 1].find((day) => day !== null);
        const prevMonth = prevFirst ? Number(prevFirst.date.slice(5, 7)) - 1 : -1;
        return month !== prevMonth ? MONTHS[month] : "";
      }),
    [weeks],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-[2px] text-text-muted">GITHUB CONTRIBUTIONS</span>
          {!loading && !failed && (
            <span className="font-mono text-[11px] text-text-secondary">
              {selected ? describeDay(selected) : `${total} total`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              aria-label="Select contributions year"
              className="cursor-pointer appearance-none rounded-[4px] border border-border-glow-soft bg-chip py-1.5 pl-3 pr-8 font-mono text-[11px] font-medium uppercase tracking-[1.5px] text-text-primary outline-none transition-colors hover:border-violet hover:text-violet focus:border-violet"
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-[140px] w-full rounded-[6px]" />
      ) : failed ? (
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${USERNAME} GitHub contributions`}
          className="block overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface px-4 py-3 transition-colors hover:border-violet md:px-6 md:py-4"
        >
          <Image
            src={`https://ghchart.rshah.org/39d353/${USERNAME}`}
            alt={`GitHub contributions graph for ${USERNAME}`}
            width={1200}
            height={220}
            unoptimized
            loading="lazy"
            className="h-auto w-full"
          />
        </a>
      ) : (
        <div className="rounded-[6px] border border-border-glow-soft bg-surface px-4 py-3 md:px-6 md:py-4">
          <div className="themed-scrollbar overflow-x-auto">
          <div className="flex w-full min-w-[780px] flex-col gap-[3px]">
            <div className="flex items-center gap-[3px]">
              <span className="sticky left-0 z-10 w-8 shrink-0 bg-surface" />
              <div className="flex flex-1 gap-[3px]">
                {monthLabels.map((label, i) => (
                  <span key={i} className="relative h-3 min-w-[11px] flex-1">
                    {label && (
                      <span className="absolute left-0 top-0 font-mono text-[9px] leading-3 text-text-muted">
                        {label}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            {WEEKDAYS.map((weekday, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-[3px]">
                <span className="sticky left-0 z-10 w-8 shrink-0 bg-surface font-mono text-[9px] leading-3 text-text-muted">
                  {weekday}
                </span>
                <div className="flex flex-1 gap-[3px]">
                  {weeks.map((week, weekIndex) => {
                    const day = week[rowIndex];
                    return (
                      <span key={weekIndex} className="min-w-[11px] flex-1">
                        {day === null ? (
                          <span className="block aspect-square w-full" />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelected(selected?.date === day.date ? null : day)}
                            title={describeDay(day)}
                            aria-label={describeDay(day)}
                            style={{ backgroundColor: levels[day.level] ?? levels[0] }}
                            className={`block aspect-square w-full rounded-[2px] outline-offset-[1px] transition-[outline-color] ${
                              selected?.date === day.date
                                ? "outline outline-1 outline-text-primary"
                                : "outline outline-1 outline-transparent hover:outline-text-muted"
                            }`}
                          />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          </div>
          <div className="flex items-center justify-end gap-1.5 pt-3">
            <span className="font-mono text-[9px] text-text-muted">Less</span>
            {levels.map((color) => (
              <span key={color} style={{ backgroundColor: color }} className="h-[11px] w-[11px] rounded-[2px]" />
            ))}
            <span className="font-mono text-[9px] text-text-muted">More</span>
          </div>
        </div>
      )}
    </div>
  );
}

