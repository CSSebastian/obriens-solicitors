import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * The single site-wide button. Every filled/outlined button and button-styled
 * link routes through here — no one-off button styles live anywhere else.
 *
 * Variants:
 *  - primary          solid navy, light text      (on LIGHT backgrounds)
 *  - primary-inverse  solid light, navy text       (on NAVY backgrounds)
 *  - outline          1px navy border, navy text   (on LIGHT backgrounds)
 *  - outline-inverse  1px white border, white text (on NAVY backgrounds)
 *  - ghost            text + trailing arrow, no chrome (the "Read more →" link)
 *
 * Sizes: `default` (h-11 / 44px — the touch tap-target floor) and `small`
 * (h-9 / 36px, desktop-only dense contexts such as the nav). Both are ~15–25%
 * tighter than the old h-12 / px-6 buttons.
 *
 * Colours come only from design tokens; hover is a subtle background/border
 * shift; focus shows the global keyboard ring. No scale or shine gimmicks.
 */
export type ButtonVariant =
  | "primary"
  | "primary-inverse"
  | "outline"
  | "outline-inverse"
  | "ghost";

export type ButtonSize = "default" | "small";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-navy text-text-on-dark hover:bg-navy-deep",
  "primary-inverse":
    "bg-button-light text-text-on-light hover:bg-button-light-hover",
  outline:
    "border border-text-on-light text-text-on-light hover:bg-text-on-light hover:text-surface",
  "outline-inverse":
    "border border-text-on-dark text-text-on-dark hover:bg-text-on-dark hover:text-navy",
  ghost: "text-current hover:opacity-70",
};

const sizeClasses: Record<ButtonSize, string> = {
  // 44px tall keeps the touch tap-target floor; padding cut from px-6 → px-5.
  default: "h-11 px-5 text-base",
  // 36px — dense desktop/nav contexts (touch users get the mobile menu).
  small: "h-9 px-3.5 text-sm",
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-serif leading-none transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonElementProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type AnchorElementProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
    /** Force a plain <a> (also automatic for tel:/mailto:/http). */
    external?: boolean;
  };

export type ButtonProps = ButtonElementProps | AnchorElementProps;

function classesFor(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
): string {
  // Ghost carries no box chrome, but still gets a ≥44px tap target (a
  // negative margin keeps its visual footprint tight in flowing layouts).
  if (variant === "ghost") {
    return cn(
      "group inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-serif leading-none transition-colors duration-150 cursor-pointer",
      size === "small" ? "text-sm" : "text-base",
      variantClasses.ghost,
      className,
    );
  }
  return cn(base, sizeClasses[size], variantClasses[variant], className);
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "default", className, children } = props;

  if ("href" in props && props.href !== undefined) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props as AnchorElementProps;
    const classes = classesFor(variant, size, className);
    const content =
      variant === "ghost" ? <GhostInner>{children}</GhostInner> : children;

    const isPlainAnchor =
      external ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:") ||
      href.startsWith("http") ||
      href.startsWith("#");

    if (isPlainAnchor) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
          {...rest}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, type, ...rest } =
    props as ButtonElementProps;
  const classes = classesFor(variant, size, className);
  const content =
    variant === "ghost" ? <GhostInner>{children}</GhostInner> : children;

  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {content}
    </button>
  );
}

function GhostInner({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ChevronRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
    </>
  );
}

/**
 * Thin wrapper preserving the "Areas →" / "Read more →" call sites.
 * Renders the ghost Button so there is exactly one button implementation.
 */
export function ArrowLink({
  href,
  children,
  className,
  size = "default",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
}) {
  return (
    <Button href={href} variant="ghost" size={size} className={className}>
      {children}
    </Button>
  );
}
