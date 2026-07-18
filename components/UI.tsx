import Link from "next/link";
import { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) { return <span className="eyebrow">{children}</span>; }

export function SectionHeading({ eyebrow, title, text, center = false }: { eyebrow?: string; title: string; text?: string; center?: boolean }) {
  return <div className={`section-heading ${center ? "center" : ""}`}>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function CTA({ title, text, primary = "Book a conversation", primaryHref = "/contact", secondary, secondaryHref = "/about" }: { title: string; text: string; primary?: string; primaryHref?: string; secondary?: string; secondaryHref?: string }) {
  return <section className="cta-section"><div className="container cta-card"><div><h2>{title}</h2><p>{text}</p></div><div className="cta-actions"><Link className="button" href={primaryHref}>{primary}</Link>{secondary && <Link className="text-link light" href={secondaryHref}>{secondary} →</Link>}</div></div></section>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={item.label}>{index > 0 && <b>/</b>}{item.href ? <Link href={item.href}>{item.label}</Link> : item.label}</span>)}</nav>;
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return <div className="faq-list">{items.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>;
}
