import { NextResponse } from "next/server";

const USERNAME = "NarihitoM";
const MIN_YEAR = 2022;

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

function parseDays(html: string, year: number): ContributionDay[] {
  const days: ContributionDay[] = [];
  const tagRe = /<(?:td|rect)[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(html)) !== null) {
    const tag = match[0];
    const date = match[1];
    if (!date.startsWith(String(year))) continue;
    const level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? 0);
    const after = html.slice(match.index, match.index + 1000);
    const countMatch = /([\d,]+)\s+contribution/.exec(after);
    days.push({
      date,
      level: Number.isFinite(level) ? Math.min(Math.max(level, 0), 4) : 0,
      count: countMatch ? Number(countMatch[1].replace(/,/g, "")) : 0,
    });
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export async function GET(req: Request) {
  const currentYear = new Date().getFullYear();
  const { searchParams } = new URL(req.url);
  const requested = Number(searchParams.get("year")) || currentYear;
  const year = Math.min(Math.max(requested, MIN_YEAR), currentYear);

  const res = await fetch(
    `https://github.com/users/${USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`,
    {
      headers: { "User-Agent": "Narihito-Portfolio", Accept: "text/html" },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: "GitHub is unavailable right now" }, { status: 502 });
  }

  const days = parseDays(await res.text(), year);
  if (!days.length) {
    return NextResponse.json({ error: "No contribution data found" }, { status: 502 });
  }

  return NextResponse.json({
    year,
    total: days.reduce((sum, day) => sum + day.count, 0),
    days,
  });
}
