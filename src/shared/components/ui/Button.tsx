import Link from "next/link";
import type { ReactNode } from "react";

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
  primary: "bg-violet text-wire",
  secondary: "bg-transparent text-text-primary border border-border-glow",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-[4px] px-7 py-4 font-body text-[15px] font-semibold transition-transform duration-300 ease-out";

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
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
