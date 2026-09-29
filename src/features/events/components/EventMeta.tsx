import type { Event } from "../types/types";

export function EventMeta({
  event,
  divider = true,
  className = "",
}: {
  event: Event;
  divider?: boolean;
  className?: string;
}) {
  const rows = [
    { label: "DATE", value: event.duration },
    { label: "TYPE", value: event.type },
    { label: "HOST", value: event.host },
  ].filter((row) => row.value);

  return (
    <div className={`flex flex-col gap-2 ${divider ? "border-t border-border-glow-soft pt-4" : ""} ${className}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-4">
          <span className="w-[64px] shrink-0 pt-px font-mono text-[10px] tracking-[2px] text-text-muted">{row.label}</span>
          <span className="font-mono text-[12px] leading-[1.5] text-text-secondary">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
