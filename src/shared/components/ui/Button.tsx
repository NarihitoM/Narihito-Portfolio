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
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-violet text-wire hover:shadow-[0_10px_28px_-12px_var(--color-violet)] hover:opacity-90 active:opacity-100",
  secondary:
    "bg-transparent text-text-primary border border-border-glow hover:border-violet hover:bg-chip",
};

const baseClasses =
  "inline-flex select-none items-center justify-center rounded-[4px] px-7 py-4 font-body text-[15px] font-semibold " +
  "transition-[transform,opacity,background-color,border-color,box-shadow] duration-300 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] active:duration-100 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "motion-reduce:transform-none motion-reduce:transition-none";

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

  const { onClick, type = "button" } = props as ButtonAsButton;
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
