"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  CreditCard,
  FileText,
  Gauge,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings,
  SlidersHorizontal,
  Sun,
  WalletCards,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAdvisorContext, QuickAdvisor, type AdvisorPageContext } from "@/components/quick-advisor";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: SlidersHorizontal },
  { href: "/eligibility", label: "Eligibility", icon: Gauge },
  { href: "/cards", label: "Cards", icon: WalletCards },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/advisor", label: "Advisor", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function ProductShell({ title, subtitle, eyebrow, actions, compactHeader = false, profileCompletion = 86, searchPlaceholder = "Search cards, policies, or guidance", advisorContext: advisorContextOverride, children }: { title: string; subtitle: string; eyebrow?: string; actions?: React.ReactNode; compactHeader?: boolean; profileCompletion?: number; searchPlaceholder?: string; advisorContext?: AdvisorPageContext; children: React.ReactNode }) {
  const pathname = usePathname();
  const advisorContext = advisorContextOverride ?? getAdvisorContext(pathname);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("credlytic-theme");
    const frame = window.requestAnimationFrame(() => {
      if (saved === "light" || saved === "dark") setTheme(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("credlytic-theme", nextTheme);
  }

  return (
    <main className="product-shell" data-theme={theme}>
      <aside className={`app-sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand-row">
          <Link className="sidebar-brand" href="/" onClick={() => setMenuOpen(false)}>
            <span className="brand-symbol"><CreditCard aria-hidden="true" /></span>
            <span><strong>Credlytic</strong><small>Credit intelligence</small></span>
          </Link>
          <button aria-label="Close navigation" className="mobile-close" onClick={() => setMenuOpen(false)} type="button"><X /></button>
        </div>

        <nav className="sidebar-nav" aria-label="Product navigation">
          <p className="sidebar-label">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href === "/cards" && pathname.startsWith("/cards/"));
            return (
              <Link className={`sidebar-link ${active ? "sidebar-link-active" : ""}`} href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-trust">
          <span className="trust-dot" />
          <div><strong>Private by design</strong><p>Eligibility checks do not affect your credit score.</p></div>
        </div>

        <Link className="sidebar-user" href="/profile">
          <span className="user-avatar">MS</span>
          <span><strong>Meera Shah</strong><small>Profile {profileCompletion}% complete</small></span>
        </Link>
      </aside>
      {menuOpen ? <button aria-label="Close navigation overlay" className="sidebar-scrim" onClick={() => setMenuOpen(false)} type="button" /> : null}

      <section className="app-main">
        <header className={`app-topbar ${compactHeader ? "app-topbar-with-title" : ""}`}>
          <button aria-label="Open navigation" className="mobile-menu" onClick={() => setMenuOpen(true)} type="button"><Menu /></button>
          {compactHeader ? <div className="topbar-page-title"><strong>{title}</strong><span>{subtitle}</span></div> : null}
          <div className="global-search"><Search aria-hidden="true" /><span>{searchPlaceholder}</span><kbd>⌘ K</kbd></div>
          <div className="topbar-actions">
            <button aria-label={`Use ${theme === "dark" ? "light" : "dark"} theme`} className="icon-button" onClick={toggleTheme} title={`Use ${theme === "dark" ? "light" : "dark"} theme`} type="button">
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            <button aria-label="Notifications" className="icon-button" title="Notifications" type="button"><Bell /></button>
          </div>
        </header>

        <div className="page-canvas">
          {!compactHeader ? <header className="page-intro">
            <div>
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            {actions ? <div className="page-actions">{actions}</div> : null}
          </header> : actions ? <div className="compact-page-actions">{actions}</div> : null}
          {children}
        </div>
      </section>
      {pathname !== "/advisor" ? <QuickAdvisor context={advisorContext} /> : null}
    </main>
  );
}
