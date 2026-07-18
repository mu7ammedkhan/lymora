"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNav } from "@/lib/site";
import { Wordmark } from "@/components/Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Wordmark inverse />
        <button className="menu-button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          <span /> <span />
        </button>
        <nav className={`main-nav ${open ? "nav-open" : ""}`} aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <Link href="/contact" className="button button-small" onClick={() => setOpen(false)}>Talk to Lymora <span>↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
