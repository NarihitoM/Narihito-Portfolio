import Link from "next/link";

export function DetailCta({
  href,
  align = "center",
}: {
  href: string;
  route?: string;
  align?: "center" | "start" | "end";
}) {
  const justify = align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";

  return (
    <div className={`flex ${justify}`}>
      <Link
        href={href}
        className="group inline-flex h-12 md:h-10 w-full md:w-auto items-center justify-center gap-1.5 rounded-[4px] border border-border-glow-soft px-[18px] md:px-4 font-body text-[13px] font-medium text-text-primary transition-[color,transform,background-color] duration-150 ease-out hover:bg-fill-glow-soft active:scale-95 active:text-violet"
      >
        See more
        <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 group-active:translate-x-1.5">→</span>
      </Link>
    </div>
  );
}
