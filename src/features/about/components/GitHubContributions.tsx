"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useTheme } from "@/shared/hooks/useTheme";

const USERNAME = "NarihitoM";
const MIN_YEAR = 2022;
const GREENS = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
} as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

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
    fetch(`/api/github-contributions?year=${year}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDays(data.days ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
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
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-violet transition-colors hover:text-text-primary"
          >
            @{USERNAME}
          </a>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label="Select contributions year"
            className="cursor-pointer rounded-[4px] border border-border-glow-soft bg-surface px-2 py-1 font-mono text-[11px] text-text-primary outline-none transition-colors hover:border-violet focus:border-violet"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
        <div className="themed-scrollbar overflow-x-auto rounded-[6px] border border-border-glow-soft bg-surface px-4 py-3 md:px-6 md:py-4">
          <div className="flex w-full min-w-[740px] flex-col gap-1.5">
            <div className="flex gap-[3px]">
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
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex min-w-[11px] flex-1 flex-col gap-[3px]">
                  {week.map((day, dayIndex) =>
                    day === null ? (
                      <span key={dayIndex} className="aspect-square w-full" />
                    ) : (
                      <button
                        key={dayIndex}
                        type="button"
                        onClick={() => setSelected(selected?.date === day.date ? null : day)}
                        title={describeDay(day)}
                        aria-label={describeDay(day)}
                        style={{ backgroundColor: levels[day.level] ?? levels[0] }}
                        className={`aspect-square w-full rounded-[2px] outline-offset-[1px] transition-[outline-color] ${
                          selected?.date === day.date
                            ? "outline outline-1 outline-text-primary"
                            : "outline outline-1 outline-transparent hover:outline-text-muted"
                        }`}
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <span className="font-mono text-[9px] text-text-muted">Less</span>
              {levels.map((color) => (
                <span key={color} style={{ backgroundColor: color }} className="h-[11px] w-[11px] rounded-[2px]" />
              ))}
              <span className="font-mono text-[9px] text-text-muted">More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

