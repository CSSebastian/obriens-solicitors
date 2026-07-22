import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "solid-light"
  | "outline-light"
  | "solid-navy"
  | "outline-dark";

const variantClasses: Record<ButtonVariant, string> = {
  // Light solid button on a navy band — "Message", "Send", "Contact".
  "solid-light":
    "bg-button-light text-text-on-light hover:bg-button-light-hover",
  // Outlined white button on a navy band — "Call", "Explore", "Discover".
  "outline-light":
    "border border-text-on-dark text-text-on-dark hover:bg-text-on-dark hover:text-navy",
  // Solid navy button on the light header bar — the phone number.
  "solid-navy": "bg-navy text-text-on-dark hover:bg-navy-deep",
  // Outlined navy button on a light band — header "Contact", "AI Chat Bot".
  "outline-dark":
    "border border-text-on-light text-text-on-light hover:bg-text-on-light hover:text-surface",
};

const base =
  "inline-flex h-12 items-center justify-center px-6 type-small whitespace-nowrap transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

type BaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type LinkProps = BaseProps & {
  href: string;
  /** Renders a plain anchor — required for `tel:`, `mailto:` and external URLs. */
  external?: boolean;
};

type NativeButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: LinkProps | NativeButtonProps) {
  const { variant = "solid-light", className, children } = props;
  const classes = cn(base, variantClasses[variant], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    const isPlainAnchor =
      external ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:") ||
      href.startsWith("http");

    if (isPlainAnchor) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  // Strip the presentational props so they never reach the DOM.
  const {
    variant: _variant,
    className: _className,
    children: _children,
    ...buttonProps
  } = props as NativeButtonProps;

  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

/** Text link with a trailing chevron — "Read more ›", "Areas ›". */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const classes = cn(
    "group inline-flex items-center gap-2 type-small transition-opacity hover:opacity-70",
    className,
  );
  const inner = (
    <>
      {children}
      <ChevronRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
    </>
  );

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
