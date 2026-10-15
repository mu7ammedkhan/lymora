import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import { HeroVideo } from "@/components/HeroVideo";
import { heroMedia, type HeroMediaKey } from "@/lib/media";

export function Eyebrow({ children }: { children: ReactNode }) { return <span className="eyebrow">{children}</span>; }

/* Headline whose words rise into place. Wrap words in *asterisks* to set them in the brand colour. */
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

export function Button({ href, children, variant = "primary", icon = "↗", className = "" }: { href: string; children: string; variant?: "primary" | "light" | "ghost" | "dark"; icon?: string; className?: string }) {
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

export function HeroMedia({ media, priority = false }: { media: HeroMediaKey; priority?: boolean }) {
  const item = heroMedia[media];
  return "video" in item
    ? <HeroVideo src={item.video} mobileSrc={item.mobile} poster={item.poster} />
    : <Image src={item.image} alt="" fill priority={priority} sizes="(max-width: 980px) 100vw, 50vw" className="hero-photo" />;
}

type PageHeroProps = {
  crumbs: { label: string; href?: string }[];
  eyebrow?: string;
  title: string;
  text?: string;
  media?: HeroMediaKey;
  meta?: string[];
  children?: ReactNode;
};

/* Interior hero: copy on the left, a framed film or photograph on the right. */
export function PageHero({ crumbs, eyebrow, title, text, media = "workforce", meta, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div className="page-hero-copy">
          <Breadcrumbs items={crumbs} />
          {eyebrow && <span className="eyebrow" data-reveal="fade">{eyebrow}</span>}
          <SplitText as="h1" text={title} />
          {text && <p data-reveal="up" style={{ "--d": "240ms" } as React.CSSProperties}>{text}</p>}
          {children && <div className="hero-actions" data-reveal="up" style={{ "--d": "340ms" } as React.CSSProperties}>{children}</div>}
          {meta && <ul className="hero-meta" data-reveal="fade" style={{ "--d": "440ms" } as React.CSSProperties}>{meta.map(item => <li key={item}>{item}</li>)}</ul>}
        </div>
        <div className="page-hero-frame" data-reveal="frame">
          <HeroMedia media={media} priority />
        </div>
      </div>
    </section>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = items.map(item => <span key={item}>{item}<i aria-hidden="true" /></span>);
  return (
    <div className="marquee" role="marquee" aria-label={items.join(", ")}>
      <div className="marquee-track" aria-hidden="true">{row}{row}</div>
    </div>
  );
}

export function CTA({ title, text, primary = "Book a conversation", primaryHref = "/contact", secondary, secondaryHref = "/about" }: { title: string; text: string; primary?: string; primaryHref?: string; secondary?: string; secondaryHref?: string }) {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card" data-reveal="up">
          <div className="cta-copy">
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-actions">
            <Button href={primaryHref} variant="light">{primary}</Button>
            {secondary && <Link className="text-link light" href={secondaryHref}>{secondary} <span>→</span></Link>}
          </div>
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
