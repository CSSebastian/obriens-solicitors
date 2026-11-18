import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity";

import { cn } from "@/lib/cn";

/**
 * Renders rich text edited in Sanity (legal pages, articles) with the site's
 * type styles. `muted` dims body text the way the legal pages always have.
 */
export function RichText({
  value,
  muted = false,
  className,
}: {
  value: PortableTextBlock[];
  muted?: boolean;
  className?: string;
}) {
  const body = cn("type-body", muted && "text-text-muted-on-dark");

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className={body}>{children}</p>,
      h2: ({ children }) => <h2 className="type-h3 pt-6 first:pt-0">{children}</h2>,
      h3: ({ children }) => <h3 className="type-h4 pt-2">{children}</h3>,
    },
    list: {
      bullet: ({ children }) => <ul className="flex flex-col gap-2">{children}</ul>,
      number: ({ children }) => (
        <ol className={cn("flex list-decimal flex-col gap-2 pl-6", body)}>{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className={cn("flex gap-3", body)}>
          <span aria-hidden>&bull;</span>
          <span>{children}</span>
        </li>
      ),
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      link: ({ value, children }) => {
        const href: string = value?.href ?? "";
        const className = "underline underline-offset-4 transition-opacity hover:opacity-70";
        return href.startsWith("/") ? (
          <Link href={href} className={className}>
            {children}
          </Link>
        ) : (
          <a
            href={href}
            className={className}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
