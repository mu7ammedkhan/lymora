import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import { HeroVideo } from "@/components/HeroVideo";
import { heroMedia, type HeroMediaKey } from "@/lib/media";

export function Eyebrow({ children }: { children: ReactNode }) { return <span className="eyebrow">{children}</span>; }

/* Headline whose words rise into place. Wrap words in *asterisks* to set them in the accent serif. */
export function SplitText({ text, as: Tag = "h2", className = "" }: { text: string; as?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  const plain = text.replace(/\*/g, "");
  let index = 0;
  const parts = text.split("*").map((segment, segmentIndex) => {
    const words = segment.split(/\s+/).filter(Boolean).map(word => (
      <Fragment key={`${segmentIndex}-${index}`}>
        <span className="sw"><span className="sw-i" style={{ "--i": index++ } as React.CSSProperties}>{word}</span></span>{" "}
      </Fragment>
    ));
    return segmentIndex % 2 ? <em key={segmentIndex}>{words}</em> : <Fragment key={segmentIndex}>{words}</Fragment>;
  });
  return <Tag className={`split-text ${className}`} aria-label={plain} data-reveal="split"><span aria-hidden="true">{parts}</span></Tag>;
}

export function Button({ href, children, variant = "primary", icon = "↗", className = "" }: { href: string; children: string; variant?: "primary" | "light" | "ghost"; icon?: string; className?: string }) {
  return (
    <Link href={href} className={`button button-${variant} ${className}`}>
      <span className="button-roll"><span data-text={children}>{children}</span></span>
      {icon && <span className={`button-icon ${icon === "↗" ? "" : "is-x"}`} aria-hidden="true"><i>{icon}</i><i>{icon}</i></span>}
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, text, center = false }: { eyebrow?: string; title: string; text?: string; center?: boolean }) {
  return <div className={`section-heading ${center ? "center" : ""}`}>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

type PageHeroProps = {
  crumbs: { label: string; href?: string }[];
  eyebrow?: string;
  title: string;
  text?: string;
  media?: HeroMediaKey;
  children?: ReactNode;
};

/* Interior hero: background film or photograph, crumbs, eyebrow, a split headline and one line. */
export function PageHero({ crumbs, eyebrow, title, text, media = "workforce", children }: PageHeroProps) {
  const item = heroMedia[media];
  return (
    <section className="page-hero" data-scroll="exit">
      <div className="page-hero-media">
        {"video" in item
          ? <HeroVideo src={item.video} mobileSrc={item.mobile} poster={item.poster} />
          : <Image src={item.image} alt="" fill priority sizes="100vw" className="page-hero-image" />}
        <span className="page-hero-shade" />
      </div>
      <div className="container page-hero-inner">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <span className="eyebrow" data-reveal="fade">{eyebrow}</span>}
        <SplitText as="h1" text={title} />
        {text && <p data-reveal="up" style={{ "--d": "260ms" } as React.CSSProperties}>{text}</p>}
        {children && <div className="hero-actions" data-reveal="up" style={{ "--d": "380ms" } as React.CSSProperties}>{children}</div>}
      </div>
    </section>
  );
}

export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = items.map(item => <span key={item}>{item}<i aria-hidden="true">✦</i></span>);
  return (
    <div className={`marquee ${className}`} aria-label={items.join(", ")} role="marquee">
      <div className="marquee-track" aria-hidden="true">{row}{row}</div>
    </div>
  );
}

export function CTA({ title, text, primary = "Book a conversation", primaryHref = "/contact", secondary, secondaryHref = "/about" }: { title: string; text: string; primary?: string; primaryHref?: string; secondary?: string; secondaryHref?: string }) {
  return (
    <section className="cta-section">
      <div className="container cta-card" data-scroll="view">
        <span className="cta-glow" aria-hidden="true" />
        <span className="cta-ring" aria-hidden="true" />
        <div className="cta-copy">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-actions">
          <Button href={primaryHref} variant="light">{primary}</Button>
          {secondary && <Link className="text-link light" href={secondaryHref}>{secondary} <span>→</span></Link>}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={item.label}>{index > 0 && <b>/</b>}{item.href ? <Link href={item.href}>{item.label}</Link> : item.label}</span>)}</nav>;
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return <div className="faq-list">{items.map(item => <details key={item.q}><summary>{item.q}<i aria-hidden="true" /></summary><p>{item.a}</p></details>)}</div>;
}
