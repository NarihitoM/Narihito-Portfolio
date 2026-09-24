"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

interface Stop {
  reach: number;
  length: number;
}

interface Route {
  d: string;
  total: number;
  stops: Stop[];
}

const CORNER = 32;
const TURN_SPAN = 60;
const PEN_LINE = 0.65;
const END_GAP = 24;

function sideMargin(width: number) {
  if (width >= 1024) return 120;
  if (width >= 768) return 40;
  return 20;
}

function buildRoute(width: number, tops: number[], end: number): Route {
  const margin = sideMargin(width);
  const left = margin / 2;
  const right = width - margin / 2;
  const radius = Math.min(CORNER, (right - left) / 2);
  const arc = (Math.PI * radius) / 2;

  let x = right;
  let y = tops[0];
  let length = 0;
  let d = `M ${x} ${y}`;
  const stops: Stop[] = [{ reach: y, length: 0 }];
  const addStop = (reach: number) => {
    stops.push({ reach: Math.max(reach, stops[stops.length - 1].reach), length });
  };

  for (const top of tops.slice(1)) {
    const nextX = x === right ? left : right;
    const dir = Math.sign(nextX - x);
    const turnStart = Math.max(y, top - radius);

    d += ` L ${x} ${turnStart}`;
    length += turnStart - y;
    addStop(turnStart - TURN_SPAN);

    d += ` A ${radius} ${radius} 0 0 ${dir < 0 ? 1 : 0} ${x + dir * radius} ${turnStart + radius}`;
    d += ` L ${nextX - dir * radius} ${turnStart + radius}`;
    d += ` A ${radius} ${radius} 0 0 ${dir < 0 ? 0 : 1} ${nextX} ${turnStart + radius * 2}`;
    length += arc * 2 + Math.abs(nextX - x) - radius * 2;
    addStop(turnStart + radius * 2 + TURN_SPAN);

    x = nextX;
    y = turnStart + radius * 2;
  }

  const finish = Math.max(y, end);
  d += ` L ${x} ${finish}`;
  length += finish - y;
  addStop(finish);

  return { d, total: length, stops };
}

function lengthAt(reach: number, stops: Stop[]) {
  if (reach <= stops[0].reach) return 0;
  for (let i = 1; i < stops.length; i++) {
    const from = stops[i - 1];
    const to = stops[i];
    if (reach > to.reach) continue;
    const span = to.reach - from.reach;
    return span > 0 ? from.length + ((reach - from.reach) / span) * (to.length - from.length) : to.length;
  }
  return stops[stops.length - 1].length;
}

export function ScrollLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const penRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const track = trackRef.current;
    const line = lineRef.current;
    const pen = penRef.current;
    const wrapper = svg?.parentElement;
    if (!svg || !track || !line || !pen || !wrapper) return;

    const sections = Array.from(wrapper.querySelectorAll<HTMLElement>(":scope > section[id]"));
    if (!sections.length) return;

    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    let route: Route | null = null;
    let frame = 0;

    const draw = () => {
      frame = 0;
      if (!route) return;
      const reach = window.innerHeight * PEN_LINE - wrapper.getBoundingClientRect().top;
      const drawn = reduced ? route.total : lengthAt(reach, route.stops);
      line.style.strokeDashoffset = `${route.total - drawn}`;

      const tip = line.getPointAtLength(drawn);
      pen.setAttribute("transform", `translate(${tip.x} ${tip.y})`);
      pen.style.opacity = drawn > 0 && drawn < route.total ? "1" : "0";
    };

    const layout = () => {
      const box = wrapper.getBoundingClientRect();
      const tops = sections.map((section) => section.getBoundingClientRect().top - box.top);
      route = buildRoute(box.width, tops, box.height - END_GAP);
      track.setAttribute("d", route.d);
      line.setAttribute("d", route.d);
      line.style.strokeDasharray = `${route.total} ${route.total}`;
      draw();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(wrapper);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-1 h-full w-full overflow-visible"
    >
      <path ref={trackRef} fill="none" strokeWidth={1} strokeDasharray="3 9" className="stroke-border-glow" />
      <path
        ref={lineRef}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-text-primary opacity-50"
      />
      <g ref={penRef} className="fill-text-primary transition-opacity duration-300" style={{ opacity: 0 }}>
        <circle r={10} opacity={0.12} />
        <circle r={3} />
      </g>
    </svg>
  );
}
