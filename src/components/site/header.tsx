"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { moreNav, primaryNav, site } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreMenuId = useId();

  // Close both menus on navigation, by adjusting state during render rather
  // than in an effect. https://react.dev/learn/you-might-not-need-an-effect
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setMoreOpen(false);
  }

  // Lock body scroll while the full-screen mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Dismiss the desktop dropdown on outside click or Escape.
  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    // z-50 keeps the full-screen mobile menu above the chat launcher, which
    // sits in a sibling stacking context at z-40.
    <header className="sticky top-0 z-50 bg-surface text-text-on-light">
      <div className="mx-auto flex h-16 w-full max-w-(--container-frame) items-center justify-between page-gutter md:h-18">
        <Logo />

        {/* Desktop navigation ------------------------------------------ */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 lg:flex"
        >
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="type-small transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-controls={moreMenuId}
              onClick={() => setMoreOpen((open) => !open)}
              className="inline-flex cursor-pointer items-center gap-1.5 type-small transition-opacity hover:opacity-70"
            >
              More
              <ChevronDownIcon
                className={`size-4 transition-transform duration-150 ${
                  moreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {moreOpen ? (
              <div
                id={moreMenuId}
                className="absolute top-full left-0 mt-3 min-w-52 border border-line-on-light bg-surface py-2 shadow-[0_12px_32px_rgba(3,3,3,0.12)] animate-fade-up"
              >
                {moreNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-5 py-2.5 type-small transition-colors hover:bg-line-on-light/40"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        {/* Desktop actions --------------------------------------------- */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/contact" variant="outline-dark">
            Contact
          </Button>
          <Button href={site.phoneHref} variant="solid-navy">
            {site.phone}
          </Button>
        </div>

        {/* Mobile trigger ---------------------------------------------- */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="-mr-2 inline-flex size-11 cursor-pointer items-center justify-center lg:hidden"
        >
          <MenuIcon className="size-6" />
        </button>
      </div>

      {/* Full-screen mobile menu ---------------------------------------- */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-surface text-text-on-light lg:hidden">
          <div className="mx-auto flex h-16 w-full max-w-(--container-frame) shrink-0 items-center justify-between page-gutter">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="-mr-2 inline-flex size-11 cursor-pointer items-center justify-center"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-(--container-frame) flex-1 flex-col gap-6 overflow-y-auto page-gutter pt-8 pb-10"
          >
            <ul className="flex flex-col gap-5">
              {[...primaryNav, ...moreNav].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="type-h3 block"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button
                href="/contact"
                variant="outline-dark"
                className="w-full"
              >
                Contact
              </Button>
              <Button
                href={site.phoneHref}
                variant="solid-navy"
                className="w-full"
              >
                {site.phone}
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
