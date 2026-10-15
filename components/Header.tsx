"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { Wordmark } from "@/components/Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 420);
        last = y;
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-nav-open", open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""} ${open ? "is-open" : ""}`}>
      <div className="container header-inner">
        <Wordmark />
        <nav className="main-nav" aria-label="Main navigation">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? "is-active" : ""}>
                <span className="nav-roll"><span data-text={item.label}>{item.label}</span></span>
              </Link>
            );
          })}
        </nav>
        <Link href="/contact" className="button button-primary button-small header-cta">
          <span className="button-roll"><span data-text="Talk to Lymora">Talk to Lymora</span></span>
          <span className="button-icon" aria-hidden="true"><i>↗</i><i>↗</i></span>
        </Link>
        <button className="menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>

      <div className="mobile-nav" id="mobile-nav" inert={!open}>
        <div className="container">
          <nav aria-label="Mobile navigation">
            {[...mainNav, { label: "About", href: "/about" }, { label: "CAIO™ Certification", href: "/caio" }].map((item, index) => (
              <Link key={item.href} href={item.href} style={{ "--i": index } as React.CSSProperties} onClick={() => setOpen(false)}>
                <small>{String(index + 1).padStart(2, "0")}</small>{item.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className="button button-primary" onClick={() => setOpen(false)}>
            <span className="button-roll"><span data-text="Talk to Lymora">Talk to Lymora</span></span>
            <span className="button-icon" aria-hidden="true"><i>↗</i><i>↗</i></span>
          </Link>
        </div>
      </div>
    </header>
  );
}
