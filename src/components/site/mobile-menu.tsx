"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { CloseIcon } from "@/components/icons";
import { useContactModal } from "@/components/overlay/overlay-context";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { moreNav, primaryNav, site } from "@/content/site";
import { useFocusTrap } from "@/lib/use-focus-trap";

const EASE = "cubic-bezier(.22,.61,.36,1)";
const LINKS = [...primaryNav, ...moreNav];

/**
 * Full-screen navy mobile menu. Ported from the Riverglen MobileMenu:
 * staggered link reveal, focus trap + Esc + focus-return, giant links, a
 * bottom CTA. Restyled to O'Briens tokens; square corners throughout.
 */
export function MobileMenu({
  open,
  onClose,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  reduced: boolean;
}) {
  // Staggered link reveal on open (skipped under reduced motion).
  useEffect(() => {
    if (!open || reduced) return;
    requestAnimationFrame(() => {
      document
        .querySelectorAll<HTMLElement>("[data-menu-link]")
        .forEach((el, i) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(14px)";
          requestAnimationFrame(() => {
            const d = 0.05 + i * 0.06;
            el.style.transition = `opacity .5s ease ${d}s, transform .5s ${EASE} ${d}s`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
        });
    });
  }, [open, reduced]);

  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open, onClose);
  const { openContact } = useContactModal();

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-200 flex flex-col bg-navy text-text-on-dark page-gutter pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="flex min-h-16 items-center justify-between">
        <Logo tone="light" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="-mr-2 inline-flex size-12 cursor-pointer items-center justify-center"
        >
          <CloseIcon className="size-6" />
        </button>
      </div>

      <nav aria-label="Mobile" className="mt-[7vh] flex flex-col">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            data-menu-link="true"
            className="border-b border-line-on-dark/25 py-3.5 font-sans text-4xl font-medium tracking-[-0.02em] last:border-b-0"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button
          variant="primary-inverse"
          className="w-full"
          onClick={() => {
            onClose();
            openContact();
          }}
        >
          Contact
        </Button>
        <Button
          href={site.phoneHref}
          variant="outline-inverse"
          className="w-full"
          onClick={onClose}
        >
          {site.phone}
        </Button>
      </div>
    </div>
  );
}
