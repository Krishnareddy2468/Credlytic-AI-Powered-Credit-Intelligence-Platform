"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/landing/brand-lockup";

const navLinks = [
  { href: "#intelligence", label: "How it works" },
  { href: "/cards", label: "Explore cards" },
  { href: "#advisor", label: "Advisor" },
  { href: "#trust", label: "Security" }
];

/**
 * Sticky landing navigation.
 *
 * The previous header was absolutely positioned, so it left the viewport after
 * the hero and the primary CTA became unreachable for the remaining six
 * sections. It also kept every link visible on phones, overflowing narrow
 * viewports — hence the collapsed menu below the tablet breakpoint.
 */
export function LandingNav() {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="landing-header" data-condensed={condensed ? "true" : "false"}>
      <div className="landing-nav">
        <Link aria-label="Credlytic home" className="landing-nav-brand" href="/" onClick={() => setMenuOpen(false)}>
          <BrandLockup priority />
        </Link>

        <nav aria-label="Main navigation" className="landing-nav-links">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="landing-nav-actions">
          <Link className="nav-login" href="/login">
            Sign in
          </Link>
          <Link className="button button-small button-primary" href="/onboarding">
            Check my eligibility
            <ArrowRight aria-hidden="true" />
          </Link>
          <button
            aria-controls="landing-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="landing-nav-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="landing-menu" data-open={menuOpen ? "true" : "false"} hidden={!menuOpen} id="landing-menu">
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
