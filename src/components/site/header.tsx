"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { Logo } from "@/components/site/logo";
import { MobileMenu } from "@/components/site/mobile-menu";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/components/overlay/overlay-context";
import { moreNav, primaryNav, site } from "@/content/site";
import { useMediaQuery } from "@/lib/use-media-query";
import { useScrollState } from "@/lib/use-scroll-state";

const EASE = "cubic-bezier(.22,.61,.36,1)";

/** Height reserved in normal flow so the fixed header never covers content. */
const REST_HEIGHT = 68;
const COLLAPSED_HEIGHT = 54;

export function Header() {
  const pathname = usePathname();
  const { scrolled } = useScrollState();
  const { openContact } = useContactModal();
  // Riverglen switches to the hamburger at max-width: 820px. O'Briens carries
  // more in the bar (four nav items + Contact + phone vs. Riverglen's four
  // links + one CTA), so the desktop row needs ~900px to sit comfortably —
  // the breakpoint is raised to 920px so labels never wrap or cramp.
  const isMobile = useMediaQuery("(max-width: 920px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreMenuId = useId();

  // Close menus on navigation (adjust during render, not in an effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setMoreOpen(false);
  }

  // Close the mobile menu if we resize out of mobile (also during render).
  const [wasMobile, setWasMobile] = useState(isMobile);
  if (wasMobile !== isMobile) {
    setWasMobile(isMobile);
    if (!isMobile) setMenuOpen(false);
  }

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

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

  const boxTransition = `max-width .4s ${EASE}, height .4s ${EASE}, padding .4s ${EASE}, background-color .35s ease, border-color .35s ease, box-shadow .35s ease`;

  return (
    <>
      {/* Reserve the rest-height so the fixed header doesn't cover the hero. */}
      <div aria-hidden style={{ height: REST_HEIGHT }} />

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          padding: scrolled
            ? "calc(10px + env(safe-area-inset-top, 0px)) calc(14px + env(safe-area-inset-right, 0px)) 0 calc(14px + env(safe-area-inset-left, 0px))"
            : "env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) 0 env(safe-area-inset-left, 0px)",
          transition: `padding .4s ${EASE}`,
          pointerEvents: "none",
        }}
      >
        <nav
          aria-label="Main"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: scrolled ? "1120px" : "var(--container-frame)",
            height: scrolled ? COLLAPSED_HEIGHT : REST_HEIGHT,
            // ~20% tighter than Riverglen's 26/10 collapsed padding.
            padding: scrolled ? "0 8px 0 20px" : "0 clamp(20px, 3vw, 80px)",
            boxSizing: "border-box",
            background: "var(--color-surface)",
            border: `1px solid ${
              scrolled ? "var(--color-line-on-light)" : "transparent"
            }`,
            boxShadow: scrolled
              ? "0 12px 34px rgba(20, 33, 61, 0.14)"
              : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            transition: boxTransition,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              transformOrigin: "left center",
              transform: `scale(${scrolled ? 0.88 : 1})`,
              transition: `transform .4s ${EASE}`,
            }}
          >
            <Logo priority />
          </span>

          {!isMobile && (
            <div className="flex items-center gap-1">
              {primaryNav.map((link) => (
                <NavPill key={link.href} href={link.href}>
                  {link.label}
                </NavPill>
              ))}

              <div ref={moreRef} className="relative">
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls={moreMenuId}
                  onClick={() => setMoreOpen((open) => !open)}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 px-3.5 py-[7px] font-sans text-sm font-medium text-text-on-light transition-colors hover:bg-navy/8"
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
                    className="absolute top-full left-0 mt-2 min-w-52 border border-line-on-light bg-surface py-1.5 shadow-[0_12px_32px_rgba(20,33,61,0.16)]"
                  >
                    {moreNav.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2.5 font-sans text-sm text-text-on-light transition-colors hover:bg-navy/8"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="ml-2 flex items-center gap-2">
                <Button variant="outline" size="small" onClick={openContact}>
                  Contact
                </Button>
                <Button href={site.phoneHref} variant="primary" size="small">
                  {site.phone}
                </Button>
              </div>
            </div>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="-mr-1 flex size-12 cursor-pointer flex-col items-center justify-center gap-1.5"
            >
              <span className="block h-0.5 w-6 bg-text-on-light" />
              <span className="block h-0.5 w-6 bg-text-on-light" />
            </button>
          )}
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        reduced={reduced}
      />
    </>
  );
}

/** Square nav pill with a soft navy wash on hover (ports rg-navpill). */
function NavPill({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center whitespace-nowrap px-3.5 py-[7px] font-sans text-sm font-medium text-text-on-light transition-colors hover:bg-navy/8"
    >
      {children}
    </Link>
  );
}
