import Link from "next/link";

export function DetailCta({ href }: { href: string; route: string }) {
  return (
    <div className="flex md:justify-end">
      <Link
        href={href}
        className="group flex md:inline-flex h-12 md:h-auto w-full md:w-auto items-center justify-center md:justify-start gap-1.5 rounded-[4px] border border-border-glow-soft md:border-none px-[18px] md:px-0 font-body text-[13px] font-medium text-text-primary"
      >
        View Details
        <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}
