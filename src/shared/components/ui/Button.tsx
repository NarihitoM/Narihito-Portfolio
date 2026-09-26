import Link from "next/link";
import type { ReactNode } from "react";
import { scrollToTarget } from "@/shared/lib/lenis";

type ButtonVariant = "primary" | "secondary";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsLink = BaseProps & {
  href: string;
  onClick?: never;
};

type ButtonAsButton = BaseProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-violet/85 text-wire border border-white/30 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(0,0,0,0.18),0_8px_24px_-12px_rgba(0,0,0,0.55)] " +
    "hover:bg-violet/95 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-1px_0_rgba(0,0,0,0.18),0_14px_32px_-14px_var(--color-violet)]",
  secondary:
    "bg-chip text-text-primary border border-border-glow " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.08),0_8px_24px_-14px_rgba(0,0,0,0.45)] " +
    "hover:border-violet/60 hover:bg-violet/10",
};

const baseClasses =
  "relative isolate inline-flex select-none items-center justify-center overflow-hidden rounded-full px-7 py-4 font-body fs-15 font-semibold " +
  "backdrop-blur-xl backdrop-saturate-150 " +
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] " +
  "before:bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.04)_45%,transparent_60%)] " +
  "transition-[transform,opacity,background-color,border-color,box-shadow] duration-300 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] active:duration-100 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "motion-reduce:transform-none motion-reduce:transition-none " +
  "disabled:opacity-50 disabled:pointer-events-none";

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href) {
    const isHashLink = props.href.startsWith("#");
    return (
      <Link
        href={props.href}
        className={classes}
        onClick={
          isHashLink
            ? (event) => {
                event.preventDefault();
                scrollToTarget(props.href, -72);
              }
            : undefined
        }
      >
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", disabled } = props as ButtonAsButton;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
